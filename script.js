// 게시글 불러오기 및 화면 표시 (JS 탭에 넣으세요)
db.ref('posts').orderByChild('time').on('value', snap => {
    const feed = document.getElementById('feed');
    feed.innerHTML = ""; // 기존 게시글 초기화
    
    let posts = [];
    snap.forEach(c => {
        posts.push({id: c.key, ...c.val()});
    });
    
    // 최신순 정렬
    posts.reverse().forEach(p => {
        const item = document.createElement('div');
        item.className = 'feed-item';
        
        // 게시글 구조 생성
        item.innerHTML = `
            <div class="item-header" style="display:flex; justify-content:space-between;">
                <b>${p.nick || '익명'}</b> 
                <span onclick="delPost('${p.id}','${p.pw}')" style="cursor:pointer; color:#999; font-size:12px;">삭제</span>
            </div>
            <div class="content-area collapsed" id="c-${p.id}">
                ${p.img ? `<img src="${p.img}" class="feed-img" style="width:100%; border-radius:8px; margin:10px 0;">` : ''}
                <div style="white-space: pre-wrap; word-break: break-all; margin-top:5px;">${p.text}</div>
            </div>
            <div class="more-btn" id="m-${p.id}" onclick="showMore('${p.id}')" style="color:#007bff; cursor:pointer; font-size:13px; margin:10px 0;">더보기...</div>
            <div class="comment-section" id="cmts-${p.id}" style="background:#f9f9f9; border-radius:8px; padding:8px;"></div>
            <div class="comment-input-row" style="margin-top:10px; display:flex; gap:5px;">
                <input type="text" id="cn-${p.id}" placeholder="닉" style="width:40px">
                <input type="text" id="ct-${p.id}" placeholder="댓글" style="flex:1;">
                <input type="password" id="cp-${p.id}" placeholder="비번" style="width:40px">
                <button onclick="addCmt('${p.id}')">ok</button>
            </div>`;

        feed.appendChild(item);

        // 댓글 로직
        if(p.comments) {
            const cmtBox = document.getElementById('cmts-' + p.id);
            Object.keys(p.comments).forEach(k => {
                const c = p.comments[k];
                cmtBox.innerHTML += `<div style="font-size:12px; margin-bottom:4px;"><b>${c.nick}</b>: ${c.text}</div>`;
            });
        }
    });
});

// 더보기 함수
window.showMore = (id) => {
    document.getElementById('c-' + id).style.maxHeight = 'none';
    document.getElementById('m-' + id).style.display = 'none';
};

// 게시글 작성 함수 (에러 수정 버전)
window.uploadPost = () => {
    const nick = document.getElementById('nick').value || "익명";
    const pw = document.getElementById('pw').value;
    const text = document.getElementById('text').value;
    
    if(!text || !pw) return alert("내용과 비번을 입력하세요!");

    db.ref('posts').push({
        nick, pw, text, img: base64Img, time: Date.now()
    }).then(() => {
        // Codepen에서 에러 안 나게 초기화만 진행
        document.getElementById('text').value = "";
        document.getElementById('pw').value = "";
        document.getElementById('prevBox').style.display = 'none';
        base64Img = "";
    });
};
