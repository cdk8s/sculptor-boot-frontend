const prefix = 'process.env.';

exports.constant = {
    devConstant: {
        [`${prefix}SYSTEM_TITLE_OPEN`]: 'Sculptor Boot',
        [`${prefix}SYSTEM_TITLE_CLOSE`]: 'CDK8S',
        [`${prefix}LOCAL_STORAGE_TOKEN_KEY`]: 'tkey-token',
        [`${prefix}REQUEST_HEADER_TOKEN_KEY`]: 'x-token',
        [`${prefix}MOCK_SERVER`]: '/devServe',
        [`${prefix}API_SERVER`]: '/sculptor-boot-backend',
        [`${prefix}LOGOUT_URL`]: 'http://sculptor.cdk8s.com:9091/sculptor-boot-backend/logout?redirect_uri=http://localhost:8000',
        [`${prefix}REQUEST_SPLICING_TKEY_SSO_BASE_URL`]: 'http://sculptor.cdk8s.com:9091/sculptor-boot-backend/oauth/authorize?response_type=code&client_id=test_client_id_1&redirect_uri=',
        [`${prefix}REQUEST_SPLICING_TKEY_SSO_CODE_CALLBACK`]: 'http://localhost:8000/codeCallback?redirect_uri=',
    },
    testConstant: {
        [`${prefix}SYSTEM_TITLE_OPEN`]: 'Sculptor Boot',
        [`${prefix}SYSTEM_TITLE_CLOSE`]: 'CDK8S',
        [`${prefix}LOCAL_STORAGE_TOKEN_KEY`]: 'tkey-token',
        [`${prefix}REQUEST_HEADER_TOKEN_KEY`]: 'x-token',
        [`${prefix}API_SERVER`]: 'http://sculptor.cdk8s.com/sculptor-boot-backend',
        [`${prefix}LOGOUT_URL`]: 'http://sculptor.cdk8s.com/sculptor-boot-backend/logout?redirect_uri=http://sculptor.cdk8s.com/sculptor-boot-frontend',
        [`${prefix}REQUEST_SPLICING_TKEY_SSO_BASE_URL`]: 'http://sculptor.cdk8s.com/sculptor-boot-backend/oauth/authorize?response_type=code&client_id=test_client_id_1&redirect_uri=',
        [`${prefix}REQUEST_SPLICING_TKEY_SSO_CODE_CALLBACK`]: 'http://sculptor.cdk8s.com/sculptor-boot-frontend/codeCallback?redirect_uri=',
    },
    prodConstant: {
        [`${prefix}SYSTEM_TITLE_OPEN`]: 'Sculptor Boot',
        [`${prefix}SYSTEM_TITLE_CLOSE`]: 'CDK8S',
        [`${prefix}LOCAL_STORAGE_TOKEN_KEY`]: 'tkey-token',
        [`${prefix}REQUEST_HEADER_TOKEN_KEY`]: 'x-token',
        [`${prefix}API_SERVER`]: 'http://sculptor.cdk8s.com/sculptor-boot-backend',
        [`${prefix}LOGOUT_URL`]: 'http://sculptor.cdk8s.com/sculptor-boot-backend/logout?redirect_uri=http://sculptor.cdk8s.com/sculptor-boot-frontend',
        [`${prefix}REQUEST_SPLICING_TKEY_SSO_BASE_URL`]: 'http://sculptor.cdk8s.com/sculptor-boot-backend/oauth/authorize?response_type=code&client_id=test_client_id_1&redirect_uri=',
        [`${prefix}REQUEST_SPLICING_TKEY_SSO_CODE_CALLBACK`]: 'http://sculptor.cdk8s.com/sculptor-boot-frontend/codeCallback?redirect_uri=',
    },
};
