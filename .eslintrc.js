module.exports = {
  parser: 'babel-eslint', // 추가: Babel ESLint 파서를 사용합니다.
  parserOptions: {
    ecmaVersion: 2020, // 추가: 최신 ECMAScript 문법을 지원합니다.
    sourceType: 'module', // 추가: 모듈 형식을 사용합니다.
    ecmaFeatures: {
      jsx: true, // 추가: JSX 문법을 사용할 수 있도록 설정합니다.
    },
  },
  extends: [
    'eslint:recommended', // 기본 ESLint 권장 규칙 사용
    'plugin:react/recommended', // React 관련 권장 규칙 사용
    //'plugin:react-hooks/recommended', // React Hooks 권장 규칙 사용
  ],
  settings: {
    react: {
      version: 'detect', // React 버전을 자동으로 감지합니다.
    },
  },
  plugins: ['react-hooks'],
  rules: {
    // 추가: 여기에 필요한 추가 규칙을 설정할 수 있습니다.
    'react-hooks/rules-of-hooks': 'error', // 훅의 규칙을 준수하지 않으면 오류 표시
    'react-hooks/exhaustive-deps': 'warn', // useEffect 의존성 배열 확인
  },
};
