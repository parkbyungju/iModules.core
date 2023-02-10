<?php
/**
 * 이 파일은 아이모듈의 일부입니다. (https://www.imodules.io)
 *
 * 아이모듈의 모듈, 플러그인, 위젯의 인터페이스 추상 클래스를 정의한다.
 *
 * @file /classes/Component.php
 * @author Arzz <arzz@arzz.com>
 * @license MIT License
 * @modified 2023. 2. 10.
 */
abstract class Component
{
    /**
     * 컴포넌트 설정을 초기화한다.
     */
    abstract public function init(): void;

    /**
     * 각 컴포넌트에서 사용할 데이터베이스 인터페이스 클래스를 가져온다.
     *
     * @param ?string $name 데이터베이스 인터페이스 고유명
     * @param ?object $connector 데이터베이스정보
     * @return DatabaseInterface $interface
     */
    abstract public static function db(?string $name = null, ?object $connector = null): DatabaseInterface;

    /**
     * 간략화된 테이블명으로 실제 데이터베이스 테이블명을 가져온다.
     *
     * @param string $table;
     * @return string $table;
     */
    abstract public static function table(string $table): string;

    /**
     * 언어팩 코드 문자열을 가져온다.
     *
     * @param string $text 코드
     * @param ?array $placeHolder 치환자
     * @return string|array $message 치환된 메시지
     */
    abstract public static function getText(string $text, ?array $placeHolder = null): string|array;

    /**
     * 언어팩 에러코드 문자열을 가져온다.
     *
     * @param string $code 에러코드
     * @param ?array $placeHolder 치환자
     * @return string $message 치환된 메시지
     */
    abstract public static function getErrorText(string $code, ?array $placeHolder = null): string;

    /**
     * 컴포넌트명의 패키지 정보를 가져온다.
     *
     * @return string $module
     */
    abstract public static function getPackage(): object;

    /**
     * 컴포넌트명을 가져온다.
     *
     * @return string $module
     */
    abstract public static function getName(): string;

    /**
     * 컴포넌트제목을 가져온다.
     *
     * @param string $language 언어코드
     * @return string $title
     */
    abstract public static function getTitle($language = null): string;

    /**
     * 컴포넌트의 기본경로를 가져온다.
     *
     * @return string $base
     */
    abstract public static function getBase(): string;

    /**
     * 컴포넌트의 상태경로를 가져온다.
     *
     * @return string $dir
     */
    abstract public static function getDir(): string;

    /**
     * 컴포넌트의 절대경로를 가져온다.
     *
     * @return string $path
     */
    abstract public static function getPath(): string;
}
