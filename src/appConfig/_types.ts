export interface AppBranding {
	logoUrl: string;
	logoAlt: string;
	faviconUrl: string;
	appName: string;
	appShortName?: string;
	appDescription: string;
	primaryColor: string;
	themeColor?: string;
	backgroundColor?: string;
}

export interface AppMeta {
	titleTemplate?: string; // es: '%s – MyApp'
	defaultTitle: string;
	defaultDescription: string;
	keywords?: string[];
	author?: string;
	language: string;
	locale?: string;
	robots?: string;
	canonicalUrl?: string;
	social?: {
		x?: string;
		facebook?: string;
		instagram?: string;
		google?: string;
		github?: string;
		tiktok?: string;
		linkedin?: string;
	};
}

export interface AppRoutes {
	home: string;
	login?: string;
	register?: string;
	dashboard?: string;
	profile?: string;
	error?: string;
	[custom: string]: string | undefined;
}

export interface AppLegal {
	privacyPolicyUrl?: string;
	termsOfServiceUrl?: string;
	cookiePolicyUrl?: string;
	copyrightNotice?: string;
	legalName?: string;
	address?: string;
}

export interface AppFeatures {
	enableSignup: boolean;
	enableDarkMode: boolean;
	enableMultiLanguage: boolean;
	enableNotifications: boolean;
	[feature: string]: boolean;
}

export interface AppSubdomains {
	app?: string;
	auth?: string;
	[subdomain: string]: string | undefined;
}

export interface AppConfig {
	branding?: AppBranding;
	meta?: AppMeta;
	routes?: AppRoutes;
	legal?: AppLegal;
	features?: AppFeatures;
	version?: string;
	environment?: 'development' | 'staging' | 'production';
    domain?: {
        primary: string;
        subdomains: AppSubdomains & {list?: string[]};
    }
	[custom: string]: any;
}
