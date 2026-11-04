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

  // ⑥ 아이콘
  if (window.lucide) window.lucide.createIcons();
})();
