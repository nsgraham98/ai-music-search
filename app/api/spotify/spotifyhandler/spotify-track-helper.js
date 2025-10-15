
export async function POST (req) {
    try {
        const {code, refresh_token, grant_type } = await req.json ();
        if (grant_type === "refresh_token"){
            const tokens = await refreshAccessToken (refresh_token);
            return new Response (JSON.stringify (tokens), { status: 200 });
        }

        if (code) {
            const tokens = await g
        }
    }catch (error) {
        return new Response (JSON.stringify ({ error: error.message }), { status: 500 });
    }
}

