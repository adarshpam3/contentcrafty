export const validateProjectName = (projectName: string) => {
  if (!projectName) {
    return "Please enter a project name";
  }
  return null;
};