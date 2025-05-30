---
{"dg-publish":true,"title":"2023년 회고","description":"2023년에 작성했었던 회고글입니다. Product 엔지니어로 입사후 1년간 일하며 배운 DevOps 관련, 회사관련 등의 성장한 점을 기록한 기록입니다","permalink":"/projects/library/kr/p300/p330/kr-p-330-a/","dgPassFrontmatter":true,"noteIcon":"0","created":"2024-12-18T20:27:02.175+09:00","updated":"2024-12-18T20:30:50.741+09:00"}
---

현재 노트: [[Projects/Library/KR/P300/P330/KR-P-330 a\|KR-P-330 a]] 2023년 회고
상위 분류: [[Projects/Library/KR/P300/P330/KR-P-330\|KR-P-330]] 연간 회고

#회고 



![](https://i.imgur.com/cN8OqJQ.png)



![](https://i.imgur.com/7dHofRP.png)



![](https://i.imgur.com/OhcnnO0.png)

![](https://i.imgur.com/45PcmaN.png)


# 주제
# 기한: 2023.10.23 ~ 2023.10.30
# 목표
# 결과물
Link

입사 후 1년이 지나서 달라진 점

회사에 SA, DevOps Product Engineer라는 포지션으로 입사하고 약 1년 1개월이 지났다. 입사하기 전과, 입사 초창기와, 현재를 기준으로 "지금 무슨일 하고 계세요?"라는 질의에 대한 답변을 항상 생각했는데 이제 1년 정도 지나니 정리가 조금 된 것 같아 정리 회고록을 써봅니다

TL:DR
1. Infra Solution Architect의 경우 클라우드를 활용한 Computing부터 Storage , Network, Policy 등 설정
2. DevOps Product Engineer란 특정 솔루션의 기능을 최대한 활용하여 원하는 문제를 해결하는 "대답"을 제공
3. DevOps Engineer란? 개발자가 개발에 집중할 수 있도록 소스코드 -> push-blackbox -deploy->유저 파이프라인을 자동화 및 구축, 운영
4. 내가 생각하는 발전 방향은 개발 지식 및 다른 솔루션들의 특장점 지식 늘리기


입사전
입사 때 제안 받은 포지션이 Solution Architect,  GitLab DevOps Engineer라는 지금 봐도 헷갈리는 포지션이었습니다. 이걸 다음 이미지를 기준으로 나눌 수 있습니다.

시간 순으로 표현하면 다음과 같습니다.
(이렇게 딱딱 떨어진건 절대 아니고 중간중간 섞이고 하지만 대략적인 흐름은 이렇게 됐다고 생각해주시면 됩니다.)



입사후 ~ 4개월차  - Solution Architect
Cloud를 활용하여 Infra를 구축합니다. 이 단계에서 이전의 On-premise의 환경들을 구축하는데 네트워크의 발달로 이를 쉽게 구현 가능한 것이 Cloud라는 것에 대한 깨달음을 얻었습니다. 해당 기술을 구현하기 위한 bash shell, linux os, 스토리지, 네트워킹, Layer, Domain, 인증 및 권한등을 배웠습니다
추가적으로 이런 개념을 구현하기 위해 AWS의 서비스들을 사용하면서 Cloud 서비스를 익혔습니다.

예를 들어 "인프라 좀 부탁해"라는 말을 들으면 "해당 요건에 따라 스펙은 이정도의 EC2(Computing)과 공용 파일 저장소로 S3(Object Storage) Domain은 link.net(Route53)정도면 되지? 필요에 따라 https인증서를 위한 ACM이나 권한 관리용 IAM등은 추후에 이야기 하자"와 같은 인프라에 대한 어느정도의 이해와 이를 클라우드 플랫폼인 AWS로 구현하는 Infra단에 대해 익혔습니다

---
(이후 팀이 갑작스럽게 변경됩니다... 그래서 SA가 아닌 일이 갑자기 시작되면서 나는 무엇을 하고 있는가?... 라는 대답없는 질문만 던지게 돼는데 그나마 현재에 와서는 이렇게 정리가 됩니다)

---
4개월차~ 8개월차 - GitLab Engineer (Solution Engineer)
회사의 비지니스 전략에 맞춰 특정 솔루션을 맡는 엔지니어포지션이 됩니다. 가운데 있는 가운데있는 DevOps라는 layer의 정말 일부분인 GitLab이라는 솔루션에관한 배움을 터득합니다. GitLab이 가지고 있는 MileStone사용법, 그룹 관리 체계, CI/CD yaml파일, GEO와 같은 기능,라이센스 적용 방법등 뿐만 아니라 해당 솔루션에 대한 영업적인 비용이나 인원, 환불 처리등에 대한 방법을 익히게 됩니다. 

많고 많은 (Jenkins, ArgoCD, Airflow, Grafana등...)솔루션 중에 한가지인데 다른 솔루션과는 달리 여러 프로세스를 통합한 oneplatform을 목표로 하는 솔루션입니다. 그래서 PMS(Project Management Service)인 Jira의 일부기능, VCS(Version Control System)의 GIt 기능, CI(Continuous)의 Build 기능, Security( SAST,DAST,License Scanning등)기능등을 담고 있다보니 생각보다 DevOps에 대한 이해를 배우게 됩니다. 왜냐하면 고객사에서 "우리는 DevOps 솔루션으로 VCS에서는 A와 Build에서는 B를 쓰고 있는 GitLab으로 해당 부분 교체 가능한가요?"라는 질문에 답변하기 위해서 알아야 답변을 할수 있기 때문에...

이 기간 동안 GitLab이 대체할 수 있는지 여부를 답변 드리기 위해 DevOps 솔루션이 어떤 역할을 하는지, 특정 솔루션이 가지는 기능들이 어떤 문의사항과 프로세스를 가지는지, 회사가 어떻게 돈을 버는지 등에 대해 익힌 기간입니다.

8개월차~ 10개월차 - GitLab Engineer + Infra
이 때는 Docker와 Kubernetes를 위주로 배운기간입니다. 이 부분을 파면서 중간 지대를 만나게 됩니다. 왜냐하면 Docker와 Kubernetes는 Infra에 해당하는데, 마침 GitLab은 여러 방식의 구성이 가능하여 위 두가지 방식으로 구현이 가능합니다. 그래서 두 가지 방식으로 GitLab을 구현하는 방법을 익히기 위해 배워야했습니다. 하지만 이보다 더 중요한 것은 문제가 생겼을 때 "이것은 Infra단의 Docker나 Kubernetes 문제냐 DevOps의 GitLab 문제냐"라는 트러블을 해결해야 했습니다. 그러다 보니 Docker에 대한 구성방식의 원리 특히 네트워크와 kubernetes의 원리등을 이해해야 해당 트러블은 어디가 문제인지에 대한 방향감각? 같은게 생겼습니다.
추가적으로 어떤 환경에서 Docker 방식, Kubernetes방식 또는 가상화하지 않고 사용하는 Source방식들의 구축 및 운영상의 장단점에 대해 조금이지만 이야기할 수 있게 됐습니다

10개월차~ 현재
입사후 - DevOps Engineer
현재는 DevOps와 Application 사이의 회색지대를 만나서 배우는 중입니다. 이 때는 Application에 정말 빌드 및 배포를 얼마나 더 자주, 덜 실패, 더 안정적인 환경을 고려하게 됩니다. 좀 더 간단하게 정리하면 "개발자가 개발에만 집중하게 만드는 시스템 구축"이라는 문제를 해결하고 있는 중입니다. 이게 직접해보니 얼마나 힘든지 느낄 뿐만 아니라 이런 DevOps라는게 가능하게 된 이유가 자동화되고 클라우드화된 인프라 환경, 개발을 도와주는 여러 솔루션들의 발전등으로 가능해진 일이라는걸 조금 느끼게 됩니다.


이렇게 1년이 지나 갔습니다. 다음 해에는 개발에 대해 좀 더 공부할 필요를 느껴서 배워볼까 합니다. 왜냐하면 이전의 상황들에게서도 느낀건데 "개발에만 집중하는 시스템을 만들기 위한 문제"를 해결하기 위해선 사실 "개발하는데 어떤 프로세스와 어떤 어려움이 있는가"를 알아야 해결을 할 수 있을테니까요. 그래서 DevOps엔지니어 분들의 경우 많은분들이 개발을 하시다가 이 직무로 옮기시는 이유를 알게됐습니다...
추가로 배포에 관해서는 아직 부족한 부분이 많아 ArgoCD위주로 해당 도메인에대한 배움을 익혀볼까 합니다. 마지막으로 "지금 무슨일 하십니까?" 라는 질문에

1. "개발자들이 개발에만 집중하도록 하는데 도움을 주고 있습니다"
    
2. 좀 더 엄밀하게는 GitLab과 ArgoCD 위주의 솔루션을 통해 + 1
    
3. 좀 더 엄밀하게는 AWS기반에서 On-premise의 소스방식, Kubernetes방식의 인프라를 통해 +2 +1
    

예 1년지나서 달라진점 중 가장 뿌듯한 점은 제가 하는일에 좀더 엄밀하게라는 말을 붙일 수 있게 된일 같군요

글 읽어주셔서 감사합니다!

