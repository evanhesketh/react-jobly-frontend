import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class JoblyApi {
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);
    console.log("API CALL: token= ", JoblyApi.token)

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${JoblyApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get details on a company by handle. */

  static async getCompany(handle) {
    let res = await this.request(`companies/${handle}`);
    return res.company;
  }

  /** Get data for companies. Optional to filter by nameLike. */

  static async getCompanies(nameLike) {
    let res = await this.request("companies/", { nameLike });
    return res.companies;
  }

  /** Get data for jobs. Optional to filter by title. */

  static async getJobs(title) {
    let res = await this.request("jobs/", { title });
    return res.jobs;
  }

  /** Get a token when a user signs up. */

  static async getToken(username, password) {
    let res = await this.request("auth/token", { username, password }, "post");
    JoblyApi.token = res.token;
    return res.token;
  }

  /** Register a new user and return a token. */

  static async register(username, password, firstName, lastName, email) {
    let res = await this.request(
      "auth/register",
      { username, password, firstName, lastName, email },
      "post"
    );
    JoblyApi.token = res.token;
    return res.token;
  }
  /** Get details for a specific user. */

  static async getUserDetails(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Update a user's information. */

  static async update(username, firstName, lastName, email) {
    let res = await this.request(
      `users/${username}`,
      { firstName, lastName, email },
      "patch"
    );
    return res.user;
  }

  static async apply(username, jobId) {
    let res = await this.request(
      `users/${username}/jobs/${jobId}`,
      {},
      "post"
    );
    return res.applied;
  }
}

export default JoblyApi;
