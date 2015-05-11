from flask import g, render_template, url_for
import logging
from sqlalchemy.orm import class_mapper

from cinch import app, db
from cinch.auth.decorators import requires_auth
from cinch.check import run_checks
from cinch.models import PullRequest, Project
from cinch.admin import AdminView
from cinch.jenkins.views import jenkins, get_jenkins_url, JENKINS_BUILD_TEMPLATE
from cinch.jenkins.controllers import all_open_prs

logger = logging.getLogger(__name__)


AdminView  # pyflakes. just want the module imported


app.register_blueprint(jenkins, url_prefix='/jenkins')


def serialize(model, fields=None):
  """Transforms a model into a dictionary which can be dumped to JSON."""
  # first we get the names of all the columns on your model
  columns = [c.key for c in class_mapper(model.__class__).columns]

  if fields is None:
      fields = columns

  # then we return their values in a dict
  return dict((c, getattr(model, c)) for c in columns if c in fields)


def sync_label(ahead, behind):
    """ Changes the color of the label in behind and ahead of master
    The thinking is:
        * ahead and behind == error
        * ahead not behind == success
        * not ahead but behind == shouldn't show
        * not ahead and not behind == shouldn't show
    """
    if ahead == 0:
        return "warning"
    if behind > 0:
        return "warning"
    else:
        return "success"


@app.route('/')
@requires_auth
def index():
    dbsession = db.session
    pulls = dbsession.query(PullRequest).filter(
        PullRequest.is_open == True).all()
    projects = dbsession.query(Project).all()
    ready_pull_requests = []
    for pull in pulls:
        pull.checks = list(run_checks(pull))
        pull.sync_label = sync_label(pull.ahead_of_master, pull.behind_master)
        pull.url = url_for(
            'pull_request',
            project_owner=pull.project.owner,
            project_name=pull.project.name,
            number=pull.number,
        )
        if (
            all(check.status for check in pull.checks)
            and pull.behind_master == 0
        ):
            ready_pull_requests.append(pull)

    return render_template(
        'index.html',
        pull_requests=pulls,
        ready_pull_requests=ready_pull_requests,
        projects=projects,
    )


@app.route('/pull_request/<project_owner>/<project_name>/<number>')
@requires_auth
def pull_request(project_owner, project_name, number):
    session = db.session

    pull_request = session.query(PullRequest).join(Project).filter(
        PullRequest.number == number,
        Project.owner == project_owner, Project.name == project_name
    ).first()

    if pull_request is None:
        return "Unknown pull request", 404

    pull_request_project = pull_request.project

    pr_map = all_open_prs()
    jobs = pull_request_project.jobs

    job_statuses = []
    jenkins_url = get_jenkins_url()

    for job in sorted(jobs, key=lambda j: j.name):
        build_number, status = pr_map[pull_request][job.id]

        if build_number is None:
            status = None
            url = None
        else:
            url = JENKINS_BUILD_TEMPLATE.format(
                base_url=jenkins_url,
                job_name=job.name,
                build_number=build_number,
            )

        job_statuses.append(
            dict(
                build_number=build_number,
                status=status,
                url=url,
                name=job.name,
            )
        )

    pull_object = serialize(pull_request)
    pull_object['jobs'] = job_statuses
    pull_object['checks'] = map(lambda check: check.__dict__, list(run_checks(pull_request)))
    pull_object['sync_label'] = sync_label(
        pull_request.ahead_of_master, pull_request.behind_master)

    context = {
        'pull': pull_request,
        'JS_PAYLOAD': {
            'pull': pull_object,
        }
    }

    return render_template(
        'pull_request.html', **context)


# test route
@app.route('/secret/')
@requires_auth
def test_auth():
    return 'you are special %s' % g.access_token


# TODO: move
@app.template_filter('status_label')
def status_label_filter(value):
    status_map = {
        True: 'success',
        None: 'warning',
        False: 'danger',
    }
    return status_map.get(value, '')
