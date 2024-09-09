// script.js

document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('drop-area');
    const svgContainer = document.getElementById('svg-container');
    const saveBtn = document.getElementById('save-btn');
    const fileInputBtn = document.getElementById('file-input-btn');
    const fileInput = document.getElementById('file-input');

    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.style.borderColor = '#000';
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.style.borderColor = '#ccc';
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.style.borderColor = '#ccc';
        handleFile(e.dataTransfer.files[0]);
    });

    fileInputBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        handleFile(file);
    });

    function handleFile(file) {
        if (file && file.type === 'image/png') {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.setAttribute('width', img.width);
                    svg.setAttribute('height', img.height);
                    svg.setAttribute('viewBox', `0 0 ${img.width} ${img.height}`);

                    const imgElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                    imgElement.setAttributeNS(null, 'href', img.src);
                    imgElement.setAttributeNS(null, 'width', img.width);
                    imgElement.setAttributeNS(null, 'height', img.height);

                    svg.appendChild(imgElement);
                    svgContainer.innerHTML = '';
                    svgContainer.appendChild(svg);
                };
            };
            reader.readAsDataURL(file);
        } else {
            alert('PNGファイルを選択してください');
        }
    }

    saveBtn.addEventListener('click', () => {
        const svg = svgContainer.querySelector('svg');
        if (!svg) {
            alert('画像が読み込まれていません');
            return;
        }

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        const canvas = document.createElement('canvas');
        canvas.width = svg.getAttribute('width');
        canvas.height = svg.getAttribute('height');
        const context = canvas.getContext('2d');

        const img = new Image();
        img.onload = () => {
            context.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'image.png';
                a.click();
                URL.revokeObjectURL(url);
            }, 'image/png');
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
    });
});
