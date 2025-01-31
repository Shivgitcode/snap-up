import axios from "axios";

export const fetchAvatar = async () => {
  const avatarId = "Binx Bond";
  const res = await axios.get(`https://api.multiavatar.com/${avatarId}`);
  if (!(res.status === 200)) {
    throw new Error("failed to fetch");
  }
  return res.data;
};
