import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthRedirectPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const getCookie = (name) =>
            document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];

        const isNewUser = getCookie("IsNewUser");
        const tempLoginId = getCookie("TempLoginId");
        const hasAuthorization = document.cookie.includes("Authorization");

        console.log('여기!!');
        console.log(hasAuthorization);
        if (!hasAuthorization || (isNewUser === "true" && tempLoginId)) {
            navigate('/profile-setup');
        } else {
            navigate('/oauth2/callback');
        }
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-600">처리 중입니다...</p>
        </div>
    );
};

export default OAuthRedirectPage;