export const isEnglishPath = () => {
  const thisPaths = location.pathname.split("/")
  const isEnglishPath = thisPaths[1].length !== 2
  
  return isEnglishPath;
};
