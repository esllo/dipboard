# dipboard

dipboard는 빠른 텍스트 복사 및 붙여넣기를 위한 프로그램입니다.  

## 프로그램 사용법
#### 추가하기
우측 하단의 `+` 버튼을 눌러 저장되는 텍스트를 추가할 수 있습니다.

#### 복사하기
목록의 텍스트를 클릭하여 클립보드에 해당 텍스트를 복사할 수 있습니다.

#### 삭제하기
목록의 텍스트 우측 삭제 버튼을 두번 클릭하여 삭제할 수 있습니다.

#### 단축키
`(Ctrl|Cmd)+Alt+x` 를 통해 dipboard 창을 열 수 있습니다.  

#### 자동 수집
dipboard는 일정 간격으로 변경된 클립보드를 수집하여 수집됨 탭에 추가합니다.  
수집된 텍스트는 dipboard가 완전히 종료되면 사라집니다.

#### 종료
dipboard 윈도우에서 x를 눌러도 백그라운드에서 동작합니다.   
완전히 종료하려면 트레이 메뉴를 통해 종료해야 합니다.

## 사용된 프레임워크/라이브러리
- [next](https://nextjs.org/)
- [mantine](https://mantine.dev/)
- [tauri](https://tauri.app/)

## 작업 환경
- [node](https://nodejs.org/) v18
- [rust](https://www.rust-lang.org/) 1.69.0

## 프로그램 실행
### dev 환경 실행
```
git clone git@github.com:esllo/dipboard.git
cd dipboard
yarn install
yarn tauri dev
```

### 빌드 실행
```
yarn tauri build
# 이후 src-tauri/target/release 폴더 참고
```