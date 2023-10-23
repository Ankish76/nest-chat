export const encodeGlobalID = (
  typename: string,
  id: string | number | bigint,
) => `${typename}:${id}`;

export const decodeGlobalID = (globalID: string) => {
  const [typename, id] = globalID.split(':');

  return { typename, id: id || typename }; // safe gaurd if someone passed id string which is not globalId it will return id as value
};

export const decodeGlobalIdAsInt = (globalID: string) => {
  const { id } = decodeGlobalID(globalID);
  const newId = parseInt(id, 10);
  if (Number.isNaN(newId)) {
    throw Error('global id parse as int not valid number');
  }
  return newId;
};

export const decodeGlobalIdAsString = (globalID: string) => {
  const { id } = decodeGlobalID(globalID);
  return id;
};
