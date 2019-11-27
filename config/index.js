export const api = {
  // Temporary URI for api
  URI: `${process.env.BASE_URL}/get-locations`,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  auth: {
    username: "hero",
    passowrd: "digital18"
  }
};

// App Config file
export const defaultOpt = {
  // Default search radius
  radius: 5,
  // Default Localization
  local: "Pacific/Honolulu",
  // Default map center: Honolulu center
  pos: { lat: 21.33, lng: -157.845934 },
  // Cluster radius
  cluster: 4,
  // Starting zoom level
  zoom: 16
};

export const exclude = {
  atm: [],
  branch: []
}; 

export const mapConfigs = {
  // Boundries for autocomplete to only autocomplete locations within Hawaii
  AutoCompleteBounrdies: {
    north: 28.70986,
    south: 6.414690,
    east: -154.51172,
    west: 133.903774
  }
};

// Grouping of meta filters under types
export const groups = {
  ATM: ["atm"],
  Branch: ["branch","specialty","isOpen"]
}
