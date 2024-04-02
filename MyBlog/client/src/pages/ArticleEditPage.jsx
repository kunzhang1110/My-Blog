import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Alert,
  FormText,
  Form,
  FormGroup,
  FormFeedback,
  Input,
  Button,
  Col,
  Row,
  Card,
} from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  DEFAULT_INPUT,
  validateInput,
  InputWithValidation,
} from "../components/InputWithValidation";
import { AppReactMarkdown } from "../components/AppReactMarkdown.jsx";
import { Spinner } from "../components/Spinner";
import { Tag } from "../components/Tag";
import { AppBreadCrumb } from "../components/AppBreadCrumb.jsx";
import { useAppContext } from "../shared/appContext.jsx";

/** Create and update articles. If address contains id, then update; otherwise, create.
 * Use live markdown preview currently, bodyPreview is not in use. Live preview uses more browser resources*/
export const ArticleEditPage = () => {
  const [title, setTitle] = useState(DEFAULT_INPUT);
  const [body, setBody] = useState({ ...DEFAULT_INPUT, selectionStart: -1 });
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isAddingNewTag, setIsAddingNewTag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const textAreaElement = useRef();

  const navigate = useNavigate();
  const { id } = useParams();
  const { api } = useAppContext();

  const addFiles = useCallback(
    (files) => {
      if (files.length === 0) return;
      let existingImages = structuredClone(images);
      let image_dir_path_prefix,
        md_file = null;

      files.forEach((file) => {
        if (image_dir_path_prefix == null) {
          image_dir_path_prefix = file.path
            .split(file.name)
            .join("")
            .substring(1);
        }

        if (file.type.startsWith("image/")) {
          const sameNameIdx = existingImages.findIndex(
            //get index for existing image
            (img) => img.name === file.name
          );

          const newImage = {
            name: file.name.replaceAll(/\s/g, ""),
            file: file,
            previewURL: URL.createObjectURL(file),
          };
          if (sameNameIdx !== -1) {
            // replace the existing image

            existingImages = [
              ...existingImages.slice(0, sameNameIdx),
              newImage,
              ...existingImages.slice(sameNameIdx + 1),
            ];
          } else {
            //add the new image
            existingImages = [...existingImages, newImage];
          }
        } else {
          md_file = file;
        }
      });
      setImages(existingImages);

      //md file
      if (md_file != null) {
        const reader = new FileReader();
        reader.onload = () => {
          const content = reader.result
            .toString()
            .trim()
            .replaceAll(image_dir_path_prefix, ""); //remove path prefix
          const idx = content.indexOf("\n"); //idx of char that splits title and body
          setTitle({ ...title, text: content.substring(2, idx).trim() });
          setBody({ ...body, text: content.substring(idx + 3).trim() });
        };
        reader.readAsText(md_file);
      }
      setIsDragOver(false);
    },
    [images, title, body]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: addFiles,
    onDragEnter: () => {
      setIsDragOver(true);
    },
    onDragLeave: (e) => {
      e.preventDefault();
      if (e.currentTarget.contains(e.relatedTarget)) return;
      setIsDragOver(false);
    },
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/emf": [],
      "text/markdown": [".md"],
    },
    noClick: true,
  });

  const postArticle = () => {
    if (
      validateInput(title, setTitle, "title") &&
      validateInput(body, setBody, "textarea")
    ) {
      setIsLoading(true);
      let article = {
        title: title.text,
        body: body.text.replaceAll(/\r/g, ""),
        viewed: 0,
        tags: JSON.stringify(tags),
      };
      let formData = new FormData();
      images.forEach((img) => {
        formData.append("files", img.file); //collection of files with the same name "files"
      });

      Object.keys(article).forEach((key) => {
        formData.append(key, article[key]);
      });

      if (id) {
        //update article
        article["id"] = id;
        api.articles
          .updateArticle(formData, id)
          .then(() => navigate(`/articles/${id}`));
      } else {
        //create article
        api.articles
          .createArticle(formData)
          .then((resp) => resp.json())
          .then((data) => {
            setIsLoading(false);
            navigate(`/articles/${data.id}`);
          });
      }
    }
  };

  const addTag = (e) => {
    e.preventDefault();
    console.log(tagInput);
    if (tags.find((t) => t.name === tagInput)) {
      console.log("Duplicated Tag");
    } else {
      setTags([...tags, { name: tagInput.trim() }]);

      setIsAddingNewTag(false);
    }
  };

  const deleteTag = (e, name) => {
    e.preventDefault();
    setTags(tags.filter((t) => t.name !== name));
  };

  const deleteImage = (e, name) => {
    e.preventDefault();
    let remainImages = images.filter((images) => images.name !== name);
    setImages(remainImages);
  };

  const imageNameClick = (e) => {
    const imgName = e.target.childNodes[0].data;
    // const imgMdText = `![${imgName}](${imgName})`;
    const imgMdText = `<img src="${imgName}" style="width:5in;height:3in" alt="${imgName}" />`; //img tag has more customization
    navigator.clipboard.writeText(imgMdText);
    setIsAlertOpen(true);
  };

  const saveAsMarkdown = (e) => {
    e.preventDefault();
    const a = document.createElement("a");
    let content = `# ${title.text}\n` + body.text; //add title to markdown body
    let blob = new Blob([content], { type: "text/markdown" });
    a.download = `${title.text}.md`;
    a.href = URL.createObjectURL(blob);
    a.addEventListener("click", (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
    e.target.blur();
  };

  const clearAll = (e) => {
    e.preventDefault();
    setTitle(DEFAULT_INPUT);
    setBody(DEFAULT_INPUT);
    setImages([]);
    e.target.blur();
  };

  useEffect(() => {
    const imageDirectory = `UserData/${id}/`; // server image directory
    let imageUrls = [];
    if (id) {
      setIsLoading(true);
      api.articles
        .getArticle(id)
        .then((data) => {
          setTitle((t) => ({ ...t, text: data.title }));
          setBody((b) => ({ ...b, text: data.body.replaceAll(/\r/g, "") }));
          // setBodyPreview({...bodyPrview, text:data.body})
          setTags(data.tags);
          if (data.imageUrls) {
            imageUrls = data.imageUrls; //urls to existing images
          }
          setIsLoading(false);
        })
        .then(() => {
          if (imageUrls.length > 0) {
            Promise.all(
              imageUrls.map(async (filename) => {
                const resp = await fetch(`${imageDirectory}${filename}`); //get existing images
                const blob = await resp.blob();
                return {
                  name: filename,
                  file: new File([blob], filename, {
                    type: blob.type,
                  }),
                  previewURL: URL.createObjectURL(blob),
                };
              })
            ).then((fetchedImages) => setImages([...fetchedImages]));
          }
        });
    }
  }, [id]);

  useEffect(() => {
    if (isAlertOpen) {
      setTimeout(() => {
        setIsAlertOpen(false);
      }, 2000); //turn off alert in 2s
    }
  }, [isAlertOpen]);

  useEffect(() => {
    if (textAreaElement.current !== null && body.selectionStart !== -1) {
      textAreaElement.current.focus();
      textAreaElement.current.selectionStart =
        textAreaElement.current.selectionEnd = body.selectionStart + 1;
    }
  }, [body]);

  return (
    <>
      <div {...getRootProps({})} style={{ width: "100%", height: "100%" }}>
        <div>
          {isDragOver ? (
            <div id="dropZoneModal">
              <div>Drop files here</div>
            </div>
          ) : (
            <></>
          )}
        </div>
        <input {...getInputProps({})} />
        <Row>
          <Col
            md={{
              offset: 1,
              size: 10,
            }}
          >
            <AppBreadCrumb />
            {isLoading ? (
              <Spinner fullPage />
            ) : (
              <>
                <Form>
                  <h3>Title</h3>
                  <InputWithValidation
                    input={title}
                    inputType={"title"}
                    setInput={setTitle}
                    hasHiddenLabel="true"
                  />
                  {/* tags */}
                  <FormGroup>
                    <div className="d-flex justify-content-start">
                      {tags.length > 0 ? (
                        tags.map((tag) => (
                          <Tag
                            className="mx-1"
                            tag={tag}
                            edit
                            key={tag.name}
                            deleteFunc={deleteTag}
                          />
                        ))
                      ) : (
                        <></>
                      )}

                      {isAddingNewTag ? (
                        <div className="d-flex mx-2 tag-new">
                          <Input
                            className="pe-2"
                            type="text"
                            placeholder="New tag ..."
                            onChange={(e) => setTagInput(e.target.value)}
                          />
                          <Button
                            className="btn-sm mx-2"
                            color="primary"
                            onClick={(e) => addTag(e)}
                          >
                            Add
                          </Button>
                          <Button
                            className="btn-sm"
                            onClick={() => setIsAddingNewTag(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Col>
                          <Button
                            className="mx-2 fw-bolder"
                            color="primary"
                            size="sm"
                            outline
                            onClick={() => setIsAddingNewTag(true)}
                          >
                            &#43;
                          </Button>
                        </Col>
                      )}
                    </div>
                  </FormGroup>
                  {/* textarea and preview */}
                  <Row>
                    <Col md={6}>
                      <Input
                        name="textarea"
                        tag="textarea"
                        value={body.text}
                        placeholder={"Write Markdown here ..."}
                        invalid={body.isInvalid}
                        innerRef={textAreaElement}
                        onChange={(e) => {
                          setBody({
                            ...body,
                            text: e.target.value,
                            isInvalid: false,
                            invalidText: "",
                            selectionStart: -1,
                          });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Tab") {
                            e.preventDefault();
                            const { selectionStart, selectionEnd } = e.target;
                            const newBodyText =
                              body.text.substring(0, selectionStart) +
                              "\t" +
                              body.text.substring(selectionEnd);
                            setBody({
                              ...body,
                              text: newBodyText,
                              selectionStart: selectionStart,
                              isInvalid: false,
                              invalidText: "",
                            });
                          }
                        }}
                      />
                      <FormFeedback>{body.invalidText}</FormFeedback>
                    </Col>
                    <Col md={6}>
                      <div className="article-edit-preview p-2">
                        <AppReactMarkdown
                          children={body.text}
                          imgFunc={({ node, src, ...props }) => {
                            let altText = "";
                            let image = images.find(
                              //if md is written as <img>, src is as is; if md is written in ![]() format, src is uriEncoded
                              (img) =>
                                encodeURIComponent(img.name) === src ||
                                img.name === src
                            ); //find exising images
                            if (image !== undefined) {
                              src = image.previewURL;
                              altText = image.name;
                            }
                            return (
                              <img
                                className="d-block"
                                src={src}
                                {...props}
                                alt={altText}
                              />
                            );
                          }}
                        />
                      </div>
                    </Col>
                  </Row>

                  {/*buttons: post, cancel, save as markdown */}
                  <div className="d-flex mt-3 justify-content-between">
                    <FormGroup className="text-end">
                      <Button
                        className="m-1"
                        onClick={(e) => saveAsMarkdown(e)}
                        color="success"
                      >
                        Save
                      </Button>
                      <Button className="m-1" onClick={clearAll} color="danger">
                        Clear All
                      </Button>
                    </FormGroup>
                    <FormGroup className="text-end">
                      <Button
                        className="m-1"
                        onClick={() => {
                          navigate(-1);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="m-1"
                        color="primary"
                        onClick={postArticle}
                      >
                        Post
                      </Button>
                    </FormGroup>
                  </div>

                  {/* upload images */}
                  <FormGroup className="mt-2">
                    <h4>Upload Images and Markdown Files</h4>

                    <div className="dropzone">
                      <p>Drop images and Mardown files anywhere on the page</p>
                    </div>
                    <FormText>
                      <ul>
                        <li>
                          Drag a markdown file AND its associated image folder
                          together and drop anywhere on page. Upon uploading,
                          folder path references used in the markdown file will
                          be removed.
                        </li>
                        <li>
                          Click image name to copy markdown syntax text for the
                          image to clipboard.
                        </li>
                      </ul>
                    </FormText>
                    {/* image cards */}
                    <div className="mt-2 d-flex  flex-wrap justify-content-start align-items-start">
                      {images.length > 0 ? (
                        images.map((image) => (
                          <Card
                            className="image-preview m-2 text-center"
                            key={image.name}
                          >
                            <img src={image.previewURL} alt={image.name} />
                            <span
                              className="delete-cross-btn"
                              href="#"
                              onClick={(e) => deleteImage(e, image.name)}
                            >
                              &#215;
                            </span>
                            <span
                              className="d-block my-2"
                              onClick={imageNameClick}
                              style={{ cursor: "pointer" }}
                            >
                              {image.name}
                            </span>
                          </Card>
                        ))
                      ) : (
                        <></>
                      )}
                    </div>
                    <Alert
                      color="info"
                      isOpen={isAlertOpen}
                      className="alert-top"
                    >
                      Image Name Copied!
                    </Alert>
                  </FormGroup>
                </Form>
              </>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};
