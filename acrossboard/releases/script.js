const releases = [
    "AcrossBoard_v1.0.0.apk"
];

function loadReleases() {
    const releaseList = document.getElementById("release-list");
    releaseList.innerHTML = "";

    releases.sort((a, b) => {
        const versionA = a.match(/v(\d+\.\d+\.\d+)/);
        const versionB = b.match(/v(\d+\.\d+\.\d+)/);
        if (versionA && versionB) {
            return compareVersions(versionB[1], versionA[1]);
        }
        return 0;
    });

    releases.forEach(link => {
        const listItem = document.createElement("li");
        listItem.classList.add("release-item");

        const anchor = document.createElement("a");
        anchor.href = link;
        anchor.textContent = link;

        // Optional: Add a download button
        const downloadButton = document.createElement("button");
        downloadButton.textContent = "Download";
        downloadButton.classList.add("download-btn");
        downloadButton.onclick = () => {
            window.location.href = link;
        };

        listItem.appendChild(anchor);
        listItem.appendChild(downloadButton);
        releaseList.appendChild(listItem);
    });
}

function compareVersions(v1, v2) {
    const v1Parts = v1.split(".").map(Number);
    const v2Parts = v2.split(".").map(Number);
    for (let i = 0; i < v1Parts.length; i++) {
        if (v1Parts[i] > v2Parts[i]) return 1;
        if (v1Parts[i] < v2Parts[i]) return -1;
    }
    return 0;
}

loadReleases();
