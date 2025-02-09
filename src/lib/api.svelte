<script module>
    import {
		PUBLIC_ICP_SERVER_URL,
		PUBLIC_ICP_ANON_KEY
	} from '$env/static/public';

    export const onMount = () => {
        console.log('onMount');
    }

    export const getData = async (table, queryObject = {}) => {
        console.log('env', PUBLIC_ICP_SERVER_URL, PUBLIC_ICP_ANON_KEY);
        const query = Object.keys(queryObject).map(key => `${key}=${queryObject[key]}`).join('&');
        const response = await fetch(`${PUBLIC_ICP_SERVER_URL}${table}?${query}`, {
            headers: {
                'apikey': PUBLIC_ICP_ANON_KEY,
                'Accept-Profile': 'icp_download'
            },
            method: 'GET',
            mode: 'cors'
        });
        return await response.json();
    }
</script>