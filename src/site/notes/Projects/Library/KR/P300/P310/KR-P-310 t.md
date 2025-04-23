---
{"dg-publish":true,"title":"2025년 4월 1주차~3주차 회고 미수행","description":null,"permalink":"/projects/library/kr/p300/p310/kr-p-310-t/","dgPassFrontmatter":true,"noteIcon":"0","created":"2025-04-21T12:20:57.251+09:00","updated":"2025-04-22T15:29:59.268+09:00"}
---

현재 노트: [[Projects/Library/KR/P300/P310/KR-P-310 t\|KR-P-310 t]] 
상위 분류: [[Projects/Library/KR/P300/P310/KR-P-310\|KR-P-310]] 

#주간회고 
4월1주차~3주차 정리

🔒 Some Hidden Content





# 이력서, 자기소개서, 포트폴리오 개요 정리
포트폴리오 magic Prompt game 작성

- Jest에 ESM 적용하는 법 글 작성

- 125074 JS stacksize 기본값 한계 확인하기

# TextPal 프로젝트

Magic prompt game때 ai에게 의존적이었던 소셜로그인, 아키텍처 구성등을 내것으로 만들기 위해
그리고 포트폴리오용 프로젝트 (실제 유저가 사용했던 서비스)를 목표로 시작

지금까지 쌓아온 지식,실력의 총집합으로 목표중. 그래서 시작부터 한 번도 사용하지 않았던 morgan,winston을 사용함 로깅 유틸리티함수부터 구성

https://github.com/murphybread/TextPal

기획구상, 여러 기능 개발
환경구성
- 서버 및 DB구성
아키텍처 구성
- app->route->controller->service->model->db
서비스 계획
- TextBattle방식에서 주제를 scp로