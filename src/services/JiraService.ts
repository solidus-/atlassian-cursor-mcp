import AtlassianBaseService from './AtlassianBaseService';
import dotenv from 'dotenv';

dotenv.config();

interface JiraIssue {
  id: string;
  key: string;
  self: string;
  fields: {
    summary: string;
    description?: string;
    status?: {
      name: string;
    };
    issuetype?: {
      name: string;
    };
    priority?: {
      name: string;
    };
    assignee?: {
      displayName: string;
      emailAddress: string;
    };
    reporter?: {
      displayName: string;
      emailAddress: string;
    };
    created?: string;
    updated?: string;
    [key: string]: any;
  };
}

export interface CreateJiraIssuePayload {
  fields: {
    project: {
      key: string;
    };
    summary: string;
    description?: string;
    issuetype: {
      name: string;
    };
    [key: string]: any;
  };
}

export default class JiraService extends AtlassianBaseService {
  constructor() {
    super(process.env.JIRA_BASE_URL || '');
  }

  async searchIssues(jql: string, startAt: number = 0, maxResults: number = 50): Promise<{
    issues: JiraIssue[];
    total: number;
  }> {
    return this.get('/rest/api/3/search', {
      params: {
        jql,
        startAt,
        maxResults,
      },
    });
  }

  async getIssue(issueIdOrKey: string): Promise<JiraIssue> {
    return this.get(`/rest/api/3/issue/${issueIdOrKey}`);
  }

  async createIssue(payload: CreateJiraIssuePayload): Promise<{ id: string; key: string; self: string }> {
    return this.post('/rest/api/3/issue', payload);
  }

  async updateIssue(issueIdOrKey: string, payload: any): Promise<void> {
    return this.put(`/rest/api/3/issue/${issueIdOrKey}`, payload);
  }

  async assignIssue(issueIdOrKey: string, assignee: string): Promise<void> {
    return this.put(`/rest/api/3/issue/${issueIdOrKey}/assignee`, {
      accountId: assignee,
    });
  }

  async getTransitions(issueIdOrKey: string): Promise<any> {
    return this.get(`/rest/api/3/issue/${issueIdOrKey}/transitions`);
  }

  async transitionIssue(issueIdOrKey: string, transitionId: string, fields?: any): Promise<void> {
    return this.post(`/rest/api/3/issue/${issueIdOrKey}/transitions`, {
      transition: {
        id: transitionId,
      },
      fields,
    });
  }

  async addComment(issueIdOrKey: string, comment: string): Promise<any> {
    return this.post(`/rest/api/3/issue/${issueIdOrKey}/comment`, {
      body: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: comment,
              },
            ],
          },
        ],
      },
    });
  }

  async getProjects(): Promise<any[]> {
    return this.get('/rest/api/3/project');
  }

  async getIssueTypes(): Promise<any[]> {
    return this.get('/rest/api/3/issuetype');
  }
}