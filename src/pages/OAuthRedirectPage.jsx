import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthRedirectPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const getCookie = (name) =>
            document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];

        const tempLoginId = getCookie("TempLoginId");
        // const hasAuthorization = document.cookie.includes("Authorization");
        const hasAuthorization = getCookie("Authorization");

        if (tempLoginId) {
            navigate('/profile-setup');
        } else if (hasAuthorization) {
            navigate('/');
        } else {
            console.log('로그인 실패: Authorization, TempLoginId 둘 다 존재 X');
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-600">처리 중입니다...</p>
        </div>
    );
};

export default OAuthRedirectPage;