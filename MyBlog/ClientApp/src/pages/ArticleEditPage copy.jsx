import React, { useEffect, useState, useCallback } from "react";
import {
  Form,
  FormGroup,
  FormText,
  Input,
  Button,
  Col,
  Row,
  Card,
  Alert,
} from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../Auth";
import {
  DEFAULT_INPUT,
  validateInput,
  InputWithValidation,
} from "../components/InputWithValidation";
import { ReactMarkdownMemo } from "../components/ReactMarkdownMemo";
import { Spinner } from "../components/Spinner";
import { Tag } from "../components/Tag";

/** Create and update articles. If address contains id, then update; otherwise, create.
 * Use live markdown preview currently, bodyPreview is not in use. Live preview uses more browser resources*/
export const ArticleEditPage = () => {
  // const [bodyPreview, setBodyPreview] = useState({
  //   ...DEFAULT_INPUT,
  //   text: "Preview",
  // });
  const [title, setTitle] = useState(DEFAULT_INPUT);
  const [body, setBody] = useState(DEFAULT_INPUT);
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isAddingNewTag, setIsAddingNewTag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const addFiles = useCallback(
    (files) => {
      if (files.length !== 0) {
        let totalImages = structuredClone(images);
        let path_prefix,
          md_file = null;
        files.forEach((file) => {
          if (file.type.startsWith("image/")) {
            if (path_prefix == null) {
              path_prefix = file.path.split(file.name).join("").substring(1);
            }
            const sameNameIdx = totalImages.findIndex(
              (img) => img.name === file.name
            );

            const newImage = {
              name: file.name,
              file: file,
              previewURL: URL.createObjectURL(file),
            };
            if (sameNameIdx !== -1) {
              // replace the existing image

              totalImages = [
                ...totalImages.slice(0, sameNameIdx),
                newImage,
                ...totalImages.slice(sameNameIdx + 1),
              ];
            } else {
              //add the new image
              totalImages = [...totalImages, newImage];
            }
          } else {
            md_file = file;
          }
        });
        setImages(totalImages);

        //md file
        if (md_file != null) {
          const reader = new FileReader();
          reader.onload = () => {
            const content = reader.result
              .toString()
              .trim()
              .replaceAll(path_prefix, ""); //remove path prefix
            const idx = content.indexOf("\n"); //idx of char that splits title and body
            setTitle({ ...title, text: content.substring(2, idx).trim() });
            setBody({ ...body, text: content.substring(idx + 3).trim() });
          };
          reader.readAsText(md_file);
        }
      }
    },
    [images, title, body]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: addFiles,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/emf": [],
      "text/markdown": [".md"],
    },
  });

  useEffect(() => {
    const imageDirectory = `UserData/${id}/`;
    let imageUrls = [];
    if (id) {
      setIsLoading(true);
      fetch(` /api/articles/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle((t) => ({ ...t, text: data.title }));
          setBody((b) => ({ ...b, text: data.body }));
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

  const saveArticle = () => {
    if (
      validateInput(title, "title", setTitle) &&
      validateInput(body, "textarea", setBody)
    ) {
      setIsLoading(true);
      const article = {
        title: title.text,
        body: body.text,
        viewed: 0,
        tags: JSON.stringify(tags),
      };

      const headers = new Headers({
        Authorization: `Bearer ${user.token}`,
      });

      const formData = new FormData();
      images.forEach((img) => {
        formData.append("files", img.file); //collection of files with the same name "files"
      });

      Object.keys(article).forEach((key) => {
        formData.append(key, article[key]);
      });

      if (id) {
        article["id"] = id;
        fetch(` /api/articles/${id}`, {
          method: "PUT",
          body: formData,
          headers,
          cache: "default",
        }).then(() => navigate(`/articles/${id}`));
      } else {
        fetch(` /api/articles`, {
          method: "POST",
          body: formData,
          headers,
          cache: "default",
        }).then(() => {
          setIsLoading(false);
          navigate("/");
        });
      }
    }
  };

  const addTag = (e) => {
    e.preventDefault();
    if (tags.find((t) => t.name === tagInput)) {
      console.log("Duplicated Tag");
    } else {
      setTags([...tags, { id: null, name: tagInput.trim() }]);
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
    const imgMdText = `![${imgName}](${imgName})`;
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

  return (
    <Row>
      <Col
        md={{
          offset: 1,
          size: 10,
        }}
      >
        {isLoading ? (
          <Spinner fullPage />
        ) : (
          <>
            <h1>{id ? "Edit" : "New"} Article</h1>
            <Form>
              <InputWithValidation
                input={title}
                inputType={"title"}
                setInput={setTitle}
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
                  <InputWithValidation
                    input={body}
                    inputType={"textarea"}
                    hasHiddenLabel={true}
                    setInput={setBody}
                  />
                </Col>
                <Col md={6}>
                  <div className="article-edit-preview p-2">
                    <ReactMarkdownMemo
                      children={body.text}
                      imgFunc={({ node, src, ...props }) => {
                        let altText = "";
                        let image = images.find((img) => img.name === src); //find exising images
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
                      deps={[body, images]}
                    />
                  </div>
                </Col>
              </Row>

              {/*buttons: post, cancel, save as markdown */}
              <div className="d-flex justify-content-between">
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
                  {/* <Button color="success" onClick={() => setBodyPreview(body)}>
            Preview
          </Button> */}
                  <Button className="m-1" color="primary" onClick={saveArticle}>
                    Post
                  </Button>
                </FormGroup>
              </div>

              {/* upload images */}
              <FormGroup>
                <h4>Upload Images and Markdown Files</h4>
                <div {...getRootProps({ className: "dropzone" })}style={{width:'100%', height:'100%'}}>
                  <Input {...getInputProps()} />
                  <p>
                    Drop images and Mardown files here, or click to select files
                  </p>
                </div>
                <FormText>
                  <ul>
                    <li>
                      Support uploading a markdown file along with its
                      associated image folder. Upon uploading, folder path
                      references used in the markdown file will be removed.
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
                <Alert color="info" isOpen={isAlertOpen} className="alert-top">
                  Image Name Copied!
                </Alert>
              </FormGroup>
            </Form>
          </>
        )}
      </Col>
    </Row>
  );
};
