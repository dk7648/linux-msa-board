import React from 'react';
import '@/styles/View.css';

const View: React.FC = () => {
  return (
    <div id="iuqk-2">
      <header className="main-header" id="i3jmen">
        <h1 id="iza06l">MSA 시각화</h1>
        <div className="user-profile" id="igdnzy">
          <div className="user-avatar" id="i3y7tk">테</div>
          <div className="user-info" id="il0pyk">
            <span className="username" id="i624zv">테스트 사용자</span>
            <span className="email" id="ivk341">test@example.com</span>
          </div>
          <button type="button" className="logout-btn" id="ixnqzz">로그아웃</button>
        </div>
      </header>
      <main className="container" id="ivgz0j">
        <h2 className="content-title" id="icvgex">서비스 종속성 맵</h2>
        <div className="card viz-card" id="iwqdsj">
          <div className="viz-placeholder" id="ihkwit">
            <div className="viz-column" id="ip9j42">
              <div className="node node-gateway" id="iyna8d">
                API Gateway
              </div>
            </div>
            <div className="viz-column-services" id="ivlgpn">
              <div className="node node-service status-danger" id="ifgz01">
                user-service
              </div>
              <div className="node node-service status-success" id="i7e9to">
                post-service
              </div>
              <div className="node node-service status-success" id="inbeqi">
                comment-service
              </div>
            </div>
          </div>
        </div>
        <div className="card info-card" id="ibpvmu">
          <h3 id="i26nll">💡 범례 (Legend)</h3>
          <p id="iwojnk">서비스 노드의 테두리 색상은 현재 서비스의 건강 상태를 나타냅니다.</p>
          <ul id="ito4ry">
            <li id="iljk2t">
              <span className="legend-dot success" id="irqe1x"></span>
              <b id="ine89k">정상 (Healthy):</b> 서비스가 정상적으로 응답 중입니다.
            </li>
            <li id="i0th7g">
              <span className="legend-dot danger" id="icxif5"></span>
              <b id="ic4z72">위험 (Danger):</b> 서비스에서 장애 또는 높은 에러율이 감지되었습니다. (예: user-service)
            </li>
            <li id="iedcm8">
              <span className="legend-dot neutral" id="irjoml"></span>
              <b id="ij5kwm">중립 (Neutral):</b> 게이트웨이 등 요청을 중계하는 서비스입니다.
            </li>
          </ul>
        </div>
        <nav className="bottom-nav" id="ibm915">
          <button type="button" className="nav-button" id="iy6j3j">
            📊 실시간 매트릭
          </button>
          <button type="button" className="nav-button active" id="i578au">
            🔍 MSA 시각화
          </button>
          <button type="button" className="nav-button disabled" id="iycm8i">
            📋 게시글 (준비중)
          </button>
        </nav>
      </main>
    </div>
  );
};

export default View;