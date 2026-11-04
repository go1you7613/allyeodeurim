/* =========================================================
   알려드림 프로토타입 공통 JS (Vanilla, 서버 통신 없음)
   ① 앱 하단 탭 넣기   ② 화면 상태 전환(?state=)
   ③ 토글, 칩, 탭       ④ 팝업 열기, 닫기
   ⑤ 필수 체크 후 버튼 켜기   ⑥ Lucide 아이콘
   ========================================================= */
(function () {
  var body = document.body;

  // ① 앱 하단 탭 (body data-tab 값으로 현재 탭 표시)
  var TABS = [
    { key: 'alarm', href: 'A10.html', icon: 'bell', label: '알림' },
    { key: 'news', href: 'A20.html', icon: 'megaphone', label: '소식' },
    { key: 'sub', href: 'A30.html', icon: 'bookmark', label: '내 구독' },
    { key: 'set', href: 'A40.html', icon: 'settings', label: '설정' }
  ];
  var phone = document.querySelector('.phone');
  if (body.dataset.tab && phone) {
    var nav = document.createElement('nav');
    nav.className = 'tabbar';
    nav.setAttribute('aria-label', '하단 메뉴');
    TABS.forEach(function (t) {
      var a = document.createElement('a');
      a.href = t.href;
      if (t.key === body.dataset.tab) a.setAttribute('aria-current', 'page');
      a.innerHTML = '<i data-lucide="' + t.icon + '"></i><span>' + t.label + '</span>';
      nav.appendChild(a);
    });
    phone.appendChild(nav);
  }

  // ② 화면 상태: 주소 뒤 ?state=empty 처럼 붙이면 data-state가 맞는 요소만 보임
  var state = new URLSearchParams(location.search).get('state') || 'default';
  document.querySelectorAll('[data-state]').forEach(function (el) {
    el.hidden = el.dataset.state.split(' ').indexOf(state) === -1;
  });

  // ③ 토글 스위치
  document.querySelectorAll('.toggle').forEach(function (t) {
    t.addEventListener('click', function () {
      t.setAttribute('aria-checked', t.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
    });
  });
  // 칩: 같은 묶음(data-chip-group) 안에서 하나만 선택
  document.querySelectorAll('[data-chip-group]').forEach(function (g) {
    g.querySelectorAll('.chip').forEach(function (c) {
      c.addEventListener('click', function () {
        g.querySelectorAll('.chip').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        c.setAttribute('aria-pressed', 'true');
      });
    });
  });
  // 탭: data-tab-target 값의 패널만 보임
  document.querySelectorAll('[role="tablist"]').forEach(function (list) {
    var tabs = list.querySelectorAll('[role="tab"]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (x) {
          x.setAttribute('aria-selected', 'false');
          var p = document.getElementById(x.dataset.tabTarget);
          if (p) p.hidden = true;
        });
        tab.setAttribute('aria-selected', 'true');
        var panel = document.getElementById(tab.dataset.tabTarget);
        if (panel) panel.hidden = false;
      });
    });
  });

  // ④ 팝업: data-open="팝업id" 로 열고 data-close 로 닫음
  function openModal(id) { var m = document.getElementById(id); if (m) m.classList.add('is-open'); }
  document.querySelectorAll('[data-open]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); openModal(b.dataset.open); });
  });
  document.querySelectorAll('[data-close]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      var m = b.closest('.modal-backdrop'); if (m) m.classList.remove('is-open');
    });
  });
  if (body.dataset.modalOpen) openModal(body.dataset.modalOpen); // 팝업 화면(A03 등)은 열린 채 시작

  // ⑤ 필수 체크: data-require-all 영역의 required 체크가 모두 켜져야 data-submit 버튼 사용 가능
  document.querySelectorAll('[data-require-all]').forEach(function (area) {
    var boxes = area.querySelectorAll('input[required]');
    var all = area.querySelector('[data-check-all]');
    var btn = document.querySelector('[data-submit]');
    function sync() {
      var ok = Array.prototype.every.call(boxes, function (b) { return b.checked; });
      if (btn) btn.disabled = !ok;
      if (all) all.checked = ok;
    }
    boxes.forEach(function (b) { b.addEventListener('change', sync); });
    if (all) all.addEventListener('change', function () {
      boxes.forEach(function (b) { b.checked = all.checked; }); sync();
    });
    sync();
  });
  // 비활성 버튼이 링크 역할을 할 때: 켜졌을 때만 이동
  document.querySelectorAll('button[data-href]').forEach(function (b) {
    b.addEventListener('click', function () { if (!b.disabled) location.href = b.dataset.href; });
  });

  // ⑦ 관리자 공통 레이아웃: body data-area(inst, local, console) + data-menu(화면 ID)
  //    상단 바와 왼쪽 메뉴를 넣고, 화면의 <main class="admin-main">을 본문 자리에 둠
  var AREAS = {
    inst: {
      area: '기관 관리자', org: '가나시청', user: '관리자A (대표)', logout: 'B01.html',
      menu: [
        { id: 'B10', label: '대시보드', icon: 'layout-dashboard' },
        { group: '기관 소식' },
        { id: 'B20', label: '기관 소식 작성', icon: 'send' },
        { id: 'B21', label: '예약 목록', icon: 'calendar-clock' },
        { id: 'B22', label: '발송 결과', icon: 'list-checks', also: ['B23'] },
        { group: '기관 정보' },
        { id: 'B30', label: '구독자 현황', icon: 'users' },
        { id: 'B40', label: '기관 프로필', icon: 'building-2' },
        { id: 'B50', label: '사용량, 요금', icon: 'receipt' },
        { group: '계정' },
        { id: 'B60', label: '담당자 계정 관리', icon: 'user-cog', also: ['B61'], owner: true },
        { id: 'B70', label: '내 정보', icon: 'user' }
      ]
    },
    local: {
      area: '로컬 관리자', org: '가나시청 설치 모듈', user: 'admin', logout: 'C01.html',
      menu: [
        { id: 'C10', label: '연결 상태', icon: 'activity' },
        { group: '수집 설정' },
        { id: 'C20', label: 'DB 연결', icon: 'database' },
        { id: 'C21', label: '수집 게시판', icon: 'list', also: ['C22'] },
        { id: 'C30', label: '발송 이력', icon: 'history' },
        { group: '환경 설정' },
        { id: 'C40', label: '중계서버 연결', icon: 'server' },
        { id: 'C41', label: '관리자 계정', icon: 'user-cog' },
        { id: 'C42', label: '로그 보관', icon: 'archive' }
      ]
    },
    console: {
      area: '운영자 콘솔', org: '알려드림 운영', user: '운영자1', logout: 'D01.html',
      menu: [
        { id: 'D10', label: '대시보드', icon: 'layout-dashboard' },
        { group: '기관' },
        { id: 'D20', label: '기관 관리', icon: 'building-2', also: ['D21', 'D22'] },
        { id: 'D30', label: '기관별 단가', icon: 'tag' },
        { id: 'D31', label: '월 정산', icon: 'calculator' },
        { group: '연동' },
        { id: 'D40', label: '수집기 관리', icon: 'rss', also: ['D41'] },
        { id: 'D42', label: '수집 실패 내역', icon: 'alert-triangle' },
        { id: 'D50', label: '설치 모듈 현황', icon: 'server', also: ['D51'] },
        { group: '앱 운영' },
        { id: 'D60', label: '앱 공지', icon: 'clipboard-list', also: ['D61'] },
        { id: 'D62', label: '기관 노출 관리', icon: 'eye' },
        { group: '계정' },
        { id: 'D70', label: '운영자 계정 관리', icon: 'user-cog', also: ['D71'] }
      ]
    }
  };
  var cfg = AREAS[body.dataset.area];
  var main = document.querySelector('.admin-main');
  if (cfg && main) {
    body.classList.add('admin-body');
    var cur = body.dataset.menu;
    var top = document.createElement('header');
    top.className = 'admin-top';
    top.innerHTML =
      '<button class="icon-btn admin-top__menu" aria-label="메뉴 열기"><i data-lucide="menu"></i></button>' +
      '<a class="admin-top__brand" href="' + cfg.menu[0].id + '.html"><i data-lucide="bell"></i>알려드림</a>' +
      '<span class="admin-top__area">' + cfg.area + '</span><span class="admin-top__spacer"></span>' +
      '<span class="admin-top__user"><i data-lucide="building-2"></i><span>' + cfg.org + '</span></span>' +
      '<span class="admin-top__user"><i data-lucide="user"></i><span>' + cfg.user + '</span></span>' +
      '<a class="btn btn--ghost btn--sm" href="' + cfg.logout + '"><i data-lucide="log-out"></i>로그아웃</a>';
    var wrap = document.createElement('div');
    wrap.className = 'admin-wrap';
    var lnb = document.createElement('nav');
    lnb.className = 'lnb';
    lnb.setAttribute('aria-label', cfg.area + ' 메뉴');
    var ul = document.createElement('ul');
    cfg.menu.forEach(function (m) {
      var li = document.createElement('li');
      if (m.group) { li.className = 'lnb__group'; li.textContent = m.group; }
      else {
        var on = m.id === cur || (m.also && m.also.indexOf(cur) > -1);
        li.innerHTML = '<a href="' + m.id + '.html"' + (on ? ' aria-current="page"' : '') + '><i data-lucide="' + m.icon + '"></i>' + m.label + '</a>';
      }
      ul.appendChild(li);
    });
    lnb.appendChild(ul);
    main.parentNode.insertBefore(top, main);
    main.parentNode.insertBefore(wrap, main);
    wrap.appendChild(lnb);
    wrap.appendChild(main);
    top.querySelector('.admin-top__menu').addEventListener('click', function () { lnb.classList.toggle('is-open'); });
  }

  // ⑧ 글자 수 표시: data-count="최대" 입력칸 옆 [data-count-for="입력칸id"]
  document.querySelectorAll('[data-count-for]').forEach(function (out) {
    var el = document.getElementById(out.dataset.countFor);
    if (!el) return;
    var max = el.getAttribute('maxlength');
    function upd() { out.textContent = el.value.length + ' / ' + max; }
    el.addEventListener('input', upd); upd();
  });
  // 라디오에 따라 보이기: input[data-show="요소id"] 선택 시 보임, 같은 name의 다른 값이면 숨김
  document.querySelectorAll('input[type="radio"][data-show]').forEach(function (r) {
    function sync() {
      document.querySelectorAll('input[name="' + r.name + '"][data-show]').forEach(function (x) {
        var t = document.getElementById(x.dataset.show); if (t) t.hidden = !x.checked;
      });
    }
    document.querySelectorAll('input[name="' + r.name + '"]').forEach(function (x) { x.addEventListener('change', sync); });
    sync();
  });

  // ⑥ 아이콘
  if (window.lucide) window.lucide.createIcons();
})();
