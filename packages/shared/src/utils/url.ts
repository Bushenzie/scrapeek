import queryString from "query-string";
import tldts from "tldts";

export const parseURL = (url: string) => {
	const urlObject = new URL(url);
	const domainInfo = tldts.parse(url);
	const queryParams = queryString.parse(urlObject.search);

	const parsedURL = {
		originalUrl: url,
		subdomain: domainInfo.subdomain,
		domain: domainInfo.domain,
		hostname: urlObject.hostname,
		path: urlObject.pathname,
		protocol: urlObject?.protocol?.replace(":", ""),
		credentials: {
			username: urlObject.username,
			password: urlObject.password,
		},
		tld: domainInfo.publicSuffix,
		fragment: urlObject.hash,
		port: urlObject.port,
		query: queryParams,
	};

	return parsedURL;
};

export type ParsedURL = ReturnType<typeof parseURL>
