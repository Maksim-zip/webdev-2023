const titleElement = document.getElementById('inputTitle'); // document - объект, getBy..- метод; у документа по айди inputTitle воьми элемент
const subtitleElement = document.getElementById('inputSubtitle');
const authorElement = document.getElementById('inputAuthor');
const dateElement = document.getElementById('inputDate');
const form = document.forms[0];
const contentElement = document.getElementById('inputContent');

const articlePreviewTitleElement = document.getElementById('articlePreviewTitle');
const articlePreviewSubtitleElement = document.getElementById('articlePreviewSubtitle');

const postcardPreviewTitleElement = document.getElementById('postcardPreviewTitle');
const postcardPreviewSubtitleElement = document.getElementById('postcardPreviewSubtitle');

const postcardPreviewAuthorElement = document.getElementById('postcardPreviewAuthor');

const postcardPreviewDateElement = document.getElementById('postcardPreviewDate');

const inputAuthorImageElement = document.getElementById('inputAuthorImage');
const authorImageCameraElement = document.getElementById('authorImageCamera');
const uploadAuthorImageTextElement = document.getElementById('uploadAuthorImageText');
const removeAuthorImageElement = document.getElementById('removeAuthorImage');
const authorImageElement = document.getElementById('authorImage');
const postcardPreviewAuthorImageElement = document.getElementById('postcardPreviewAuthorImage');

const inputMainImageElement = document.getElementById('inputMainImage');
const articleCoverElement = document.getElementById('articleCover');
const mainImageRemarkElement = document.getElementById('mainImageRemark');
const mainImageControllerElement = document.getElementById('mainImageController');
const removeMainImageButtonElement = document.getElementById('removeMainImageButton');
const articlePreviewImageElement = document.getElementById('articlePreviewImage');

const inputPreviewImageElement = document.getElementById('inputPreviewImage');
const postcardCoverElement = document.getElementById('postcardCover');
const previewImageRemarkElement = document.getElementById('previewImageRemark');
const previewImageControllerElement = document.getElementById('previewImageController');
const removePreviewImageButtonElement = document.getElementById('removePreviewImageButton');
const postcardPreviewImageElement = document.getElementById('postcardPreviewImage');


let authorImage = '';
let postImage = '';
let postImageName = '';

titleElement.addEventListener(
    'input', 
    () => {
        if (titleElement.value === '') {
            if (titleElement.classList.contains('form-row__input_filled')) {
                titleElement.classList.remove('form-row__input_filled');
            }
            articlePreviewTitleElement.innerHTML = 'New Post';
            postcardPreviewTitleElement.innerHTML = 'New Post';
        }
        else {
            if (!titleElement.classList.contains('form-row__input_filled')) {
                titleElement.classList.add('form-row__input_filled');
            }
            articlePreviewTitleElement.innerHTML = titleElement.value;
            postcardPreviewTitleElement.innerHTML = titleElement.value;
        }
    }
)

subtitleElement.addEventListener(
    'input', 
    () => {
        if (subtitleElement.value === '') {
            if (subtitleElement.classList.contains('form-row__input_filled')) {
                subtitleElement.classList.remove('form-row__input_filled');
            }
            articlePreviewSubtitleElement.innerHTML = 'Please, enter any description';
            postcardPreviewSubtitleElement.innerHTML = 'Please, enter any description';
        }
        else {
            if (!subtitleElement.classList.contains('form-row__input_filled')) {
                subtitleElement.classList.add('form-row__input_filled');
            }
            articlePreviewSubtitleElement.innerHTML = subtitleElement.value;
            postcardPreviewSubtitleElement.innerHTML = subtitleElement.value;
        }
    }
)

authorElement.addEventListener(
    'input',
    () => {
        if (authorElement.value === '') {
            if (authorElement.classList.contains('form-row__input_filled')) {
                authorElement.classList.remove('form-row__input_filled');
            }
            postcardPreviewAuthorElement.innerHTML = 'Enter author name';
        }
        else {
            if (!authorElement.classList.contains('form-row__input_filled')) {
                authorElement.classList.add('form-row__input_filled');
            }
            postcardPreviewAuthorElement.innerHTML = authorElement.value;
        }
    }

)

dateElement.addEventListener(
    'input',
    () => {
        if (dateElement.value === '') {
            if (dateElement.classList.contains('form-row__input_filled')) {
                dateElement.classList.remove('form-row__input_filled');
            }
            postcardPreviewDateElement.innerHTML = '4/19/2023';
        }
        else {
            if (!dateElement.classList.contains('form-row__input_filled')) {
                dateElement.classList.add('form-row__input_filled');
            }
            postcardPreviewDateElement.innerHTML = dateElement.valueAsDate.toLocaleDateString("en-US");
        }
    }

)

inputAuthorImageElement.addEventListener(
    'change',
    (event) => {
        const readerPreviewAuthorImage = new FileReader();
        readerPreviewAuthorImage.addEventListener(
            'load',
            () => {
                if (readerPreviewAuthorImage.result === '') {
                    return;
                }
                authorImageCameraElement.classList.remove('hidden');
                uploadAuthorImageTextElement.innerHTML = 'Upload New';
                removeAuthorImageElement.classList.remove('hidden');
                authorImageElement.style.background = 'url(' + readerPreviewAuthorImage.result + ') no-repeat';
                authorImageElement.style.backgroundSize = 'cover';
                postcardPreviewAuthorImageElement.style.background = 'url(' + readerPreviewAuthorImage.result + ') no-repeat';
                postcardPreviewAuthorImageElement.style.backgroundSize = 'cover';
                authorImage = readerPreviewAuthorImage.result;
            }
        )
        if (event.target.files[0]) {
            readerPreviewAuthorImage.readAsDataURL(event.target.files[0]);
        }
    }
)

removeAuthorImageElement.addEventListener(
    'click',
    () => {
        authorImageCameraElement.classList.add('hidden');
        uploadAuthorImageTextElement.innerHTML = 'Upload';
        removeAuthorImageElement.classList.add('hidden');
        inputAuthorImageElement.value = '';
        authorImageElement.style.background = '';
        postcardPreviewAuthorImageElement.style.background = '';
    }
)

form.addEventListener(
    'submit',
    (event) => {
        event.preventDefault();
        let isError = validateQueryParams(form.elements);
        if (isError) {
            console.log('Error');
            return;
        } 
        const data = {
            title: titleElement.value,
            subtitle: subtitleElement.value,
            authorName: authorElement.value,
            publishDate: dateElement.valueAsDate.toLocaleDateString("en-US"),
            content: contentElement.value,
            authorIMGName: inputAuthorImageElement.value.replace('C:\\fakepath\\', ''),
            postIMGName: postImageName,
            authorIMG: authorImage,
            postIMG: postImage,
          }
          const json = JSON.stringify(data, null, "\t");
          console.log(json);     
    }
)

function validateQueryParams(elements) {
    let isError = false;
    for (let element of elements) {
        if (element.value === '' && element.type !== 'submit' && element.type !== 'file') {
            isError = true;
        }
    }
    if (authorImage === '' || postImage === '') {
      isError = true;
    }
    return isError;
}

inputMainImageElement.addEventListener(
    'change',
    previewImages
)

inputPreviewImageElement.addEventListener(
    'change',
    previewImages
)

removeMainImageButtonElement.addEventListener(
    'click',
    deleteImages
)

removePreviewImageButtonElement.addEventListener(
    'click',
    deleteImages
)

function previewImages(event) {
        const readerImage = new FileReader();
        readerImage.addEventListener(
            'load',
            () => {
                if (readerImage.result === '') {
                    return;
                }

                mainImageControllerElement.classList.remove('hidden');
                articleCoverElement.style.background = 'url(' + readerImage.result + ') no-repeat';
                articleCoverElement.style.backgroundSize = 'cover';
                articlePreviewImageElement.style.background = 'url(' + readerImage.result + ') no-repeat';
                articlePreviewImageElement.style.backgroundSize = 'cover';
                postImage = readerImage.result;
                mainImageRemarkElement.classList.add('hidden');
                articlePreviewImageElement.classList.add('upload__main-image_uploaded');
                articleCoverElement.classList.add('upload__main-image_uploaded');
                
                previewImageControllerElement.classList.remove('hidden');
                postcardCoverElement.style.background = 'url(' + readerImage.result + ') no-repeat';
                postcardCoverElement.style.backgroundSize = 'cover';
                postcardPreviewImageElement.style.background = 'url(' + readerImage.result + ') no-repeat';
                postcardPreviewImageElement.style.backgroundSize = 'cover';
                previewImageRemarkElement.classList.add('hidden');
                postcardPreviewImageElement.classList.add('upload__preview-image_uploaded');
                postcardCoverElement.classList.add('upload__preview-image_uploaded');

                postImageName = event.target.value.replace('C:\\fakepath\\', '');
            }
        )
        
        if (event.target.files[0]) {
            readerImage.readAsDataURL(event.target.files[0]);
        }
}

function deleteImages() {
    inputMainImageElement.value = '';
    mainImageControllerElement.classList.add('hidden');
    articleCoverElement.style.background = '';
    articlePreviewImageElement.style.background = '';
    postImage = '';
    mainImageRemarkElement.classList.remove('hidden');
    articlePreviewImageElement.classList.remove('upload__main-image_uploaded');
    articleCoverElement.classList.remove('upload__main-image_uploaded');
    
    inputPreviewImageElement.value = '';
    previewImageControllerElement.classList.add('hidden');
    postcardCoverElement.style.background = '';
    postcardPreviewImageElement.style.background = '';
    previewImageRemarkElement.classList.remove('hidden');
    postcardPreviewImageElement.classList.remove('upload__preview-image_uploaded');
    postcardCoverElement.classList.remove('upload__preview-image_uploaded');
}