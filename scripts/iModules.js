/**
 * 이 파일은 아이모듈의 일부입니다. (https://www.imodules.io)
 *
 * 아이모듈 클래스를 정의한다.
 *
 * @file /scripts/iModules.ts
 * @author Arzz <arzz@arzz.com>
 * @license MIT License
 * @modified 2023. 6. 10.
 */
class iModules {
    static language;
    /**
     * 현재 언어코드를 가져온다.
     *
     * @return {string} language
     */
    static getLanguage() {
        iModules.language ??= Html.get('html').getAttr('lang');
        return iModules.language;
    }
    /**
     * 기본 URL 경로를 가져온다.
     *
     * @return {string} baseUrl
     */
    static getBase() {
        return Html.get('body').getAttr('data-base');
    }
    /**
     * 프로세스 URL 경로를 가져온다.
     *
     * @param {'module'|'plugin'|'widget'} type - 컴포넌트 타입
     * @param {string} name - 컴포넌트명
     * @param {string} path - 실행경로
     * @return {string} processUrl
     */
    static getProcessUrl(type, name, path) {
        const is_rewrite = Html.get('body').getAttr('data-rewrite') === 'true';
        const route = '/' + type + '/' + name + '/process/' + path;
        return iModules.getBase() + (is_rewrite === true ? route + '?debug=true' : '/?route=' + route + '&debug=true');
    }
    /**
     * 모바일 디바이스인지 확인한다.
     *
     * @return {boolean} is_mobile
     */
    static isMobile() {
        return window.ontouchstart !== undefined;
    }
    /**
     * 전체 UI를 활성화한다.
     */
    static enable() {
        Html.get('body > div[data-role=disabled]').remove();
    }
    /**
     * UI를 비활성화한다.
     *
     * @param {Dom|string|null} message - 비활성화된 레이어에 표시될 메시지
     * @param {string|null} icon - 비활성화된 레이어에 표시될 아이콘 (message 가 string 인 경우)
     * @return {Dom} dom - 비활성화 레이어 Dom
     */
    static disable(message = null, icon = null) {
        iModules.enable();
        const $disabled = Html.create('div');
        $disabled.setData('role', 'disabled');
        if (message !== null) {
            if (typeof message == 'string') {
                if (icon !== null) {
                    const $icon = Html.create('i');
                    $icon.setData('role', 'icon');
                    $disabled.append($icon);
                }
                const $text = Html.create('div');
                $text.setData('role', 'text');
                $text.text(message);
                $disabled.append($text);
            }
            else if (message instanceof Dom === true) {
                $disabled.append(message);
            }
        }
        Html.get('body').prepend($disabled);
        return $disabled;
    }
}
/**
 * 아이모듈 페이지가 출력되었을 때 UI 이벤트를 등록한다.
 */
Html.ready(() => {
    /**
     * 폼 객체를 초기화한다.
     */
    Form.init();
    /**
     * 현재 페이지에 사용중인 모듈 클래스를 초기화한다.
     */
    Modules.init();
});
