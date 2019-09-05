// let accountId='220d09a6';
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const base = 'https://api.smartling.com';

const { SMARTLING_USER, SMARTLING_KEY } = process.env;

// We need some mappings from Transifex -> Smartling for the time being
// Eventually we should just define the config in terms of Smartling
const projectMapping = {
  atlaskit: 'be7350097',
};

//Make the names slightly more sensible from Smartling, not required
const mapSlug = slug => {
  return slug.endsWith('.json') ? slug : `${slug}.json`;
};

function base64ToBase64Url(input) {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  return input;
}

function decodeToken(token) {
  let jwtString = base64ToBase64Url(
    Buffer.from(token.split('.')[1], 'base64').toString(),
  );
  return JSON.parse(jwtString);
}

//Super lightweight version of the API, for use in projects that aren't using Traduki
class SmartlingNode {
  filesPrefix = project =>
    `${base}/files-api/v2/projects/${project || this.project}`;

  constructor(userId, secret, project) {
    this.userId = userId;
    this.secret = secret;
    this.project = project;
    this.accessToken = null;
    this.expiresAt = 0;
  }

  // pushTranslations,
  // getAvailableLanguages,
  // getTranslations,

  async getAvailableLanguages(project) {
    let authHeaders = await this._authHeaders();
    let theProject = project || this.project;
    let promise = await axios.get(
      `${base}/projects-api/v2/projects/${theProject}`,
      authHeaders,
    );
    // noinspection JSUnresolvedVariable
    return promise.data.response.data.targetLocales.map(i => i.localeId);
  }

  async getTranslationsForLanguage(
    project,
    resource,
    language,
    englishForUntranslated = false,
    retrieval = 'published',
  ) {
    let authHeaders = await this._authHeaders();
    let theProject = project || this.project;
    let url = `${this.filesPrefix(
      theProject,
    )}/locales/${language}/file?fileUri=${resource}&includeOriginalStrings=${englishForUntranslated}&retrievalType=${retrieval}`;
    let promise = await axios.get(url, authHeaders);
    return promise.data;
  }

  async pushSource(project, resource, data) {
    let theProject = project || this.project;
    let reboundProject = projectMapping[theProject];
    if (!reboundProject) {
      throw new Error(`No corresponding project found for ${theProject}`);
    }
    let authHeaders = await this._authHeaders();
    let url = `${this.filesPrefix(reboundProject)}/file`;
    let formData = new FormData();
    formData.append('file', JSON.stringify(data), {
      filename: mapSlug(resource),
    });
    formData.append('fileUri', mapSlug(resource));
    formData.append('fileType', 'json');
    formData.append(
      'smartling.translate_paths',
      JSON.stringify({
        path: '*/translation',
        key: '{*}/translation',
        instruction: '*/description',
      }),
    );

    let more = formData.getHeaders();
    let combined = Object.assign({}, authHeaders.headers);
    Object.assign(combined, more);

    let promise = await axios({
      method: 'post',
      contentType: 'multipart/form-data',
      url: url,
      data: formData,
      //add
      headers: combined,
    });

    return promise.data.response.data;
  }

  async _authHeaders() {
    if (!SMARTLING_KEY) {
      throw new Error(`No smartling credentials found`);
    }
    if (Date.now() + 5000 >= this.expiresAt) {
      this.accessToken = null;
    }
    if (this.accessToken) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(`${base}/auth-api/v2/authenticate`, {
        userIdentifier: this.userId,
        userSecret: this.secret,
      });
      const token = response.data.response.data.accessToken;
      this.expiresAt = decodeToken(token).exp * 1000;
      this.accessToken = token;
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

let node = new SmartlingNode(SMARTLING_USER, SMARTLING_KEY);
module.exports = node;
