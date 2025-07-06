import axios from "axios";

export async function getLaunches() {
  return await axios.get(`https://api.spacexdata.com/v4/launches`);
}
export async function getRockets() {
  return await axios.get(`https://api.spacexdata.com/v4/rockets`);
}
export async function getPayloads() {
  return await axios.get(`https://api.spacexdata.com/v4/payloads`);
}
export async function getLaunchPads() {
  return await axios.get(`https://api.spacexdata.com/v4/launchpads`);
}