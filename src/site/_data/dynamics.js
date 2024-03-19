const fsFileTree = require("fs-file-tree");

const BASE_PATH = "src/site/_includes/components/user";
const STYLE_PATH = "src/site/styles/";
const NAMESPACES = ["index", "notes", "common"];
const SLOTS = ["head", "header", "beforeContent", "afterContent", "footer"];
const FILE_TREE_NAMESPACE = "filetree";
const FILE_TREE_SLOTS = ["beforeTitle", "afterTitle"];
const SIDEBAR_NAMESPACE = "sidebar";
const SIDEBAR_SLOTS = ["top", "bottom"];
const STYLES_NAMESPACE = "styles";

const generateComponentPaths = async (namespace, slots) => {
  const data = {};
  for (let index = 0; index < slots.length; index++) {
    const slot = slots[index];
    try {
      const tree = await fsFileTree(`${BASE_PATH}/${namespace}/${slot}`);
      let comps = Object.keys(tree)
        .filter((p) => p.indexOf(".njk") != -1)
        .map((p) => `components/user/${namespace}/${slot}/${p}`);
      comps.sort();
      data[slot] = comps;
    } catch {
      data[slot] = [];
    }
  }
  return data;
};

const generateStylesPaths = async () => {
  try {
    // Adjusted to the correct styles directory
    const tree = await fsFileTree(`src/site/styles/`);
    let comps = Object.keys(tree)
      .map((p) => `/styles/${p}`.replace('.scss', '.css'))
      // Remove custom-style.css if it's already in the array to re-add it later
      .filter((path) => !path.endsWith('custom-style.css'));
    // Sort the array to maintain a consistent order
    comps.sort();
    // Add custom-style.css at the end to ensure it's the last stylesheet
    comps.push('/styles/custom-style.css');
    return comps;
  } catch {
    return [];
  }
};

module.exports = async () => {
  const data = {};
  for (let index = 0; index < NAMESPACES.length; index++) {
    const ns = NAMESPACES[index];
    data[ns] = await generateComponentPaths(ns, SLOTS);
  }
  data[FILE_TREE_NAMESPACE] = await generateComponentPaths(
    FILE_TREE_NAMESPACE,
    FILE_TREE_SLOTS
  );
  data[SIDEBAR_NAMESPACE] = await generateComponentPaths(
    SIDEBAR_NAMESPACE,
    SIDEBAR_SLOTS
  );
  data[STYLES_NAMESPACE] = await generateStylesPaths();
  return data;
};
