const STORAGE_KEY = "voter_id";

export const getVoterId = () => {
  let voterId = localStorage.getItem(STORAGE_KEY);
  if (!voterId) {
    voterId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, voterId);
  }
  return voterId;
};
