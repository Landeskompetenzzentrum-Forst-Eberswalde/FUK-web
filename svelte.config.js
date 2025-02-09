import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		},
		define: {
			'process.env.VITE_ICP_ANON_KEY': JSON.stringify(process.env.VITE_ICP_ANON_KEY),
			'process.env.VITE_ICP_SERVER_URL': JSON.stringify(process.env.VITE_ICP_SERVER_URL)
		},
	}
};

export default config;
