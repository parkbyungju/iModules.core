/**
 * 이 파일은 아이모듈의 일부입니다. (https://www.imodules.io)
 *
 * 관리자모듈에서 사용되는 비동기호출 클래스를 정의한다.
 *
 * @file /scripts/Ajax.ts
 * @author Arzz <arzz@arzz.com>
 * @license MIT License
 * @modified 2023. 6. 10.
 */
class Ajax {
    /**
     * GET 방식으로 데이터를 가져온다.
     *
     * @param {string} url - 요청주소
     * @param {Ajax.Params} params - GET 데이터
     * @param {boolean|number} is_retry - 재시도여부
     * @return {Promise<Ajax.Results>} results - 요청결과
     */
    static async get(url: string, params: Ajax.Params = {}, is_retry: boolean | number = true): Promise<Ajax.Results> {
        const requestUrl = new URL(url, location.origin);
        for (const name in params) {
            if (params[name] === null) {
                requestUrl.searchParams.delete(name);
            } else {
                requestUrl.searchParams.append(name, params[name]);
            }
        }
        url = requestUrl.toString();
        let retry = (is_retry === false ? 10 : is_retry) as number;

        try {
            const response: Response = (await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept-Language': iModules.getLanguage(),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                cache: 'no-store',
                redirect: 'follow',
            }).catch((error) => {
                if (retry <= 3) {
                    return Ajax.get(url, params, ++retry);
                } else {
                    // @todo 에러메시지

                    console.error(error);

                    return { success: false };
                }
            })) as Response;

            const results: Ajax.Results = (await response.json()) as Ajax.Results;
            if (results.success == false && results.message !== undefined) {
                // @todo 에러메시지
            }

            return results;
        } catch (e) {
            if (retry <= 3) {
                return Ajax.get(url, params, ++retry);
            } else {
                // @todo 에러메시지

                console.error(e);

                return { success: false };
            }
        }
    }

    /**
     * POST 방식으로 데이터를 가져온다.
     * 전송할 데이터는 JSON 방식으로 전송된다.
     *
     * @param {string} url - 요청주소
     * @param {Ajax.Data|FormData} data - 전송할 데이터
     * @param {Ajax.Params} params - GET 데이터
     * @param {boolean|number} is_retry - 재시도여부
     * @return {Promise<Ajax.Results>} results - 요청결과
     */
    static async post(
        url: string,
        data: Ajax.Data | FormData = {},
        params: Ajax.Params = {},
        is_retry: boolean | number = true
    ): Promise<Ajax.Results> {
        const requestUrl = new URL(url, location.origin);
        for (const name in params) {
            if (params[name] === null) {
                requestUrl.searchParams.delete(name);
            } else {
                requestUrl.searchParams.append(name, params[name]);
            }
        }
        url = requestUrl.toString();
        let retry = (is_retry === false ? 10 : is_retry) as number;

        const headers = {};
        headers['Accept-Language'] = iModules.getLanguage();
        headers['Accept'] = 'application/json';

        let body: string | FormData;
        if (data instanceof FormData) {
            body = data;
        } else {
            headers['Content-Type'] = 'application/json; charset=utf-8';
            body = JSON.stringify(data);
        }

        try {
            const response: Response = (await fetch(url, {
                method: 'POST',
                headers: headers,
                body: body,
                cache: 'no-store',
                redirect: 'follow',
            }).catch((error) => {
                if (retry <= 3) {
                    return Ajax.post(url, data, params, ++retry);
                } else {
                    // @todo 에러메시지

                    console.error(error);

                    return { success: false };
                }
            })) as Response;

            const results: Ajax.Results = (await response.json()) as Ajax.Results;
            if (results.success == false && results.message !== undefined) {
                // @todo 에러메시지
            }

            return results;
        } catch (e) {
            if (retry <= 3) {
                return Ajax.post(url, data, params, ++retry);
            } else {
                // @todo 에러메시지

                console.error(e);

                return { success: false };
            }
        }
    }
}

namespace Ajax {
    export interface Params {
        [key: string]: string;
    }

    export interface Data {
        [key: string]: any;
    }

    export interface Results {
        success: boolean;
        message?: string;
        total?: number;
        records?: any[];
        data?: Ajax.Data;
        [key: string]: any;
    }
}
