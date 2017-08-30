import { RequestMatch } from '@angular/common/http/testing';

function getStatusText(status: number): string {
  switch (status) {
    case 200:
      return 'OK';
    case 201:
      return 'Created';
    case 204:
      return 'No Content';
    case 404:
      return 'Not Found';
    case 422:
      return 'Unprocessable Entity';
    case 503:
      return 'Service Unavailable';
  }
  throw new Error(`Unknown HTTP status code: ${status}`);
}

class TestRequest {
  constructor(
    readonly request: Request,
    private resolve: (response: Response) => void,
    private reject: (e: any) => void,
  ) {}

  flush(json: any, status: number): void {
    const body = json !== null ? JSON.stringify(json) : null;
    const init: ResponseInit = {
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      status,
      statusText: getStatusText(status),
    };
    const response = new Response(body, init);

    // Monkeypatch Response#json(), since it returns a promise that is not zone-aware.
    response.json = () => Promise.resolve(json);

    this.resolve(response);
  }

  error(e: any): void {
    this.reject(e);
  }
}

export class MockFetch {
  private stub: jasmine.Spy;
  private open: TestRequest[] = [];

  constructor() {
    this.stub = spyOn(window, 'fetch');
    this.stub.and.callFake(this.handle.bind(this));
  }

  private handle(input: RequestInfo, init?: RequestInit): Promise<Response> {
    let request: TestRequest;
    const promise = new Promise<Response>((resolve, reject) => {
      request = new TestRequest(new Request(input, init), resolve, reject);
      this.push(request);
    });
    promise.then(() => this.pop(request), () => this.pop(request));
    return promise;
  }

  public match(match: RequestMatch): TestRequest[] {
    return this.open.filter(
      (testReq) => (!match.method || testReq.request.method === match.method.toUpperCase()) &&
        (!match.url || testReq.request.url === new URL(match.url, location.href).toString()));
  }

  public expectOne(match: RequestMatch) {
    const matches = this.match(match);
    const description = this.getMatchDescription(match);
    if (matches.length > 1) {
      throw new Error(
          `Expected one matching request for criteria "${description}", found ${matches.length} requests.`);
    }
    if (matches.length === 0) {
      throw new Error(`Expected one matching request for criteria "${description}", found none.`);
    }
    return matches[0];
  }

  private getMatchDescription(match: RequestMatch) {
    const method = match.method || '(any)';
    const url = match.url || '(any)';
    return `Match method: ${method}, URL: ${url}`;
  }

  private push(request: TestRequest): void {
    this.open.push(request);
  }

  private pop(request: TestRequest): void {
    const index = this.open.indexOf(request);
    this.open.splice(index, 1);
  }

  public verify(): void {
    if (this.open.length > 0) {
      const requests = this.open.map(testReq => {
        const url = testReq.request.url;
        const method = testReq.request.method;
        return `${method} ${url}`;
      }).join(', ');
      throw new Error(`Expected no open requests, found ${this.open.length}: ${requests}`);
    }
  }
}
