/**
 * 이 파일은 아이모듈의 일부입니다. (https://www.imodules.io)
 *
 * 아이모듈 클래스를 정의한다.
 *
 * @file /scripts/iModules.ts
 * @author Arzz <arzz@arzz.com>
 * @license MIT License
 * @modified 2023. 6. 23.
 */
class iModules {
    static language: string;

    /**
     * 현재 언어코드를 가져온다.
     *
     * @return {string} language
     */
    static getLanguage(): string {
        iModules.language ??= Html.get('html').getAttr('lang');
        return iModules.language;
    }

    /**
     * 기본 URL 경로를 가져온다.
     *
     * @return {string} baseUrl
     */
    static getBase(): string {
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
    static getProcessUrl(type: string, name: string, path: string): string {
        const is_rewrite = Html.get('body').getAttr('data-rewrite') === 'true';
        const route = '/' + type + '/' + name + '/process/' + path;
        return iModules.getBase() + (is_rewrite === true ? route + '?debug=true' : '/?route=' + route + '&debug=true');
    }

    /**
     * 모바일 디바이스인지 확인한다.
     *
     * @return {boolean} is_mobile
     */
    static isMobile(): boolean {
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
    static disable(message: Dom | string | null = null, icon: string | null = null): Dom {
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
            } else if (message instanceof Dom === true) {
                $disabled.append(message);
            }
        }

        Html.get('body').prepend($disabled);
        return $disabled;
    }
}

namespace iModules {
    export namespace Absolute {
        export interface Position {
            top?: number;
            bottom?: number;
            left?: number;
            right?: number;
            maxWidth?: number;
            maxHeight?: number;
        }

        export interface Listeners {
            show?: (position: iModules.Absolute.Position) => void;
            close?: () => void;
        }
    }

    export class Absolute {
        /**
         * 절대위치 DOM 객체를 출력한다.
         *
         * @param {Dom} $target - 절대위치를 표시할 기준 DOM 객체
         * @param {Dom} $content - 절대위치 DOM 내부 콘텐츠 DOM 객체
         * @param {('x'|'y')} direction - 절대위치 DOM 이 출력될 방향
         * @param {boolean} closable - 자동닫힘 여부
         * @param {iModules.Absolute.Listeners} listeners - 이벤트리스너
         */
        static show(
            $target: Dom,
            $content: Dom,
            direction: 'x' | 'y',
            closable: boolean = true,
            listeners: iModules.Absolute.Listeners = null
        ): void {
            const $absolutes = Html.create('div', { 'data-role': 'absolutes' });
            Html.get('body').append($absolutes);
            if (closable === true) {
                $absolutes.on('mousedown', () => {
                    iModules.Absolute.close();
                });
            }

            const $absolute = Html.create('div', { 'data-role': 'absolute' });
            $absolute.on('mousedown', (e: MouseEvent) => {
                e.stopImmediatePropagation();
            });
            $absolutes.append($absolute);
            $absolute.append($content);

            const targetRect = $target.getEl().getBoundingClientRect();
            const absoluteRect = $absolute.getEl().getBoundingClientRect();
            const windowRect = { width: window.innerWidth, height: window.innerHeight };

            const position: iModules.Absolute.Position = {};

            if (direction == 'y') {
                if (
                    targetRect.bottom > windowRect.height / 2 &&
                    absoluteRect.height > windowRect.height - targetRect.bottom
                ) {
                    position.bottom = windowRect.height - targetRect.top;
                    position.maxHeight = windowRect.height - position.bottom - 10;
                } else {
                    position.top = targetRect.bottom;
                    position.maxHeight = windowRect.height - position.top - 10;
                }

                if (targetRect.left + absoluteRect.width > windowRect.width) {
                    position.right = windowRect.width - targetRect.right;
                    position.maxWidth = windowRect.width - position.right - 10;
                } else {
                    position.left = targetRect.left;
                    position.maxWidth = windowRect.width - position.left - 10;
                }
            }

            for (const name in position) {
                $absolute.setStyle(name, position[name] + 'px');
            }

            $content.setStyle('max-width', position.maxWidth + 'px');
            $content.setStyle('max-height', position.maxHeight + 'px');

            const show = listeners?.show ?? null;
            if (show !== null) {
                listeners.show(position);
            }

            if (listeners?.close) {
                $absolutes.setData('close', listeners.close, false);
            }
        }

        /**
         * 절대위치 DOM 객체를 닫는다.
         */
        static close(): void {
            const $absolutes = Html.get('body > div[data-role=absolutes]');
            if ($absolutes.getEl() !== null) {
                if (typeof $absolutes.getData('close') == 'function') {
                    $absolutes.getData('close')();
                }
                $absolutes.remove();
            }
        }
    }

    export namespace Modal {
        export interface Button {
            text: string;
            class?: string;
            handler: ($button: Dom) => void;
        }
    }

    export class Modal {
        /**
         * 모달창을 연다.
         *
         * @param {string} title - 창제목
         * @param {(string|Dom)} content - 내용
         * @param {iModules.Modal.Button[]} buttons - 버튼목록
         * @param {Function} onShow - 모달창이 열렸을 때 발생할 이벤트리스너
         */
        static show(
            title: string,
            content: string | Dom,
            buttons: iModules.Modal.Button[] = [],
            onShow: ($modal: Dom) => void = null
        ): void {
            iModules.Modal.close();

            const $modals = Html.create('div', { 'data-role': 'modals' });
            const $section = Html.create('section');

            const $modal = Html.create('div', { 'data-role': 'modal' });

            const $title = Html.create('div', { 'data-role': 'title' });
            $title.html(title);
            $modal.append($title);

            const $content = Html.create('div', { 'data-role': 'content' });
            if (typeof content == 'string') {
                $content.html(content);
            } else {
                $content.append(content);
            }
            $modal.append($content);

            const $buttons = Html.create('div', { 'data-role': 'buttons' });
            $modal.append($buttons);

            if (buttons.length == 0) {
                buttons.push({
                    text: Language.printText('buttons.close'),
                    class: 'confirm',
                    handler: () => {
                        iModules.Modal.close();
                    },
                });
            }

            for (const button of buttons) {
                const $button = Html.create('button', { 'data-role': 'button', 'type': 'button' });
                $button.html(button.text);
                $button.on('click', () => {
                    button.handler($button);
                });
                if (button.class) {
                    $button.addClass(button.class);
                }
                $buttons.append($button);
            }

            $section.append($modal);
            $modals.append($section);

            Html.get('body').append($modals);
            if (typeof onShow == 'function') {
                onShow($modal);
            }
        }

        /**
         * 모달창을 닫는다.
         */
        static close(): void {
            Html.get('body > div[data-role=modals]').remove();
        }
    }
}

/**
 * 아이모듈 페이지가 출력되었을 때 UI 이벤트를 등록한다.
 */
Html.ready(() => {
    Html.get('body').setAttr('data-device', iModules.isMobile() == true ? 'mobile' : 'desktop');

    /**
     * 폼 객체를 초기화한다.
     */
    Form.init();

    /**
     * 현재 페이지에 사용중인 모듈 클래스를 초기화한다.
     */
    Modules.init();

    /**
     * 스크롤바를 처리한다.
     */
    Scrollbar.init();

    /**
     * 리사이즈 이벤트를 처리한다.
     */
    new ResizeObserver(() => {
        iModules.Absolute.close();
    }).observe(document.body);
});
