from sqlalchemy.orm import class_mapper


def serialize(model, fields=None):
  """Transforms a model into a dictionary which can be dumped to JSON."""
  # first we get the names of all the columns on your model
  columns = [c.key for c in class_mapper(model.__class__).columns]

  if fields is None:
      fields = columns

  # then we return their values in a dict
  return dict((c, getattr(model, c)) for c in columns if c in fields)
