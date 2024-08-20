'use client';
import axios from 'axios';
import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse'
import {unified} from 'unified'
import React, { useEffect, useState } from 'react';
import { VFile } from 'vfile';
import { Container, Row, Col, Card, Form, InputGroup, Image, Button, ButtonGroup } from 'react-bootstrap';
import { useUrl } from '../compoent/UrlContext';

const OTA = () => {
    const { url } = useUrl();
    //MakerbaseMoon  3d_scanner_esp
    const [username, setUsername] = useState("");
    const [repo, setRepo] = useState("");

    const [github, setGithub] = useState({
        "username": "",
        "repo": "",
    });

    const [releases, setReleases] = useState([]);
    const [index, setIndex] = useState(0);
    const [assets, setAssets] = useState([]);
    const [file, setFile] = useState<VFile | undefined>(undefined);

    const handleReleaseChange = async(event: React.ChangeEvent<HTMLSelectElement>) => {
        setIndex(parseInt(event.target.value));
        setAssets(releases[parseInt(event.target.value)]["assets"]);
        const file = await unified()
            .use(remarkParse)
            .use(remarkHtml)
            .process(releases[parseInt(event.target.value)]["body"]);
        setFile(file);
    }

    const flash = (type: string, id: number) => {
        axios.get(`http://${url}/api/ota?type=${type}&username=${github.username}&repo=${github.repo}&id=${id}`)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        axios.get(`http://${url}/api/info`)
            .then((response) => {
                const github = response.data['data']['github'];
                console.log(`GitHub: ${github}`);
                setGithub(github);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [url]);

    useEffect(() => {
        if (github.username !== "" && github.repo !== "") {
            // Get the Release List information 
            axios.get(`https://api.github.com/repos/${github.username}/${github.repo}/releases`, 
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                })
                .then(async(response) => {
                    console.log(response.data);
                    setReleases(response.data);
                    setAssets(response.data[0]["assets"]);
                    const file = await unified()
                        .use(remarkParse)
                        .use(remarkHtml)
                        .process(response.data[0]["body"]);
                    setFile(file);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [github]);

    const statusOTAUpdate = () => {
        setGithub({ username, repo });
    }

    const espOTAUpdate = () => {
        axios.get(`http://${url}/api/ota?type=esp32&username=${github.username}&repo=${github.repo}`)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
        setGithub({ username, repo });
    }

    return (
        <main className='d-flex'> 
            <Container className='flex-grow-1 d-flex'>
                <div className='d-flex flex-grow-1'>
                    <div className='d-flex flex-grow-1'>
                        <Card bg="light" className='flex-grow-1 my-5 mx-4'>
                            <Card.Header className='text-center'>OTA</Card.Header>
                            <Card.Body>
                                <Form>
                                    <Row className="mb-3">
                                        <Col md={3}>
                                            <InputGroup>
                                                <InputGroup.Text id="basic-addon1">Username</InputGroup.Text>
                                                <Form.Control 
                                                    placeholder={username} 
                                                    onChange={(e) => setUsername(e.target.value)}
                                                />
                                            </InputGroup>
                                        </Col>
                                        <Col md={3}>
                                            <InputGroup>
                                                <InputGroup.Text id="basic-addon1">Repo</InputGroup.Text>
                                                <Form.Control 
                                                    placeholder={repo} 
                                                    onChange={(e) => setRepo(e.target.value)}
                                                />
                                            </InputGroup>
                                        </Col>
                                        <Col md={2} className='text-center'>
                                            <Button onClick={statusOTAUpdate}>OTAUpdate</Button>
                                        </Col>
                                        <Col md={2} className='text-center'>
                                            <Button onClick={espOTAUpdate}>ESP32 Update</Button>
                                        </Col>
                                        <Col xs={2}>
                                            <Form.Select onChange={handleReleaseChange} defaultValue={releases.length > 0 ? releases[0]["tag_name"] : "v0.0.0"} >
                                            { 
                                                (releases.length > 0) ? (
                                                    releases.map((release, index) => (
                                                        <option key={release["id"]} value={index} >{release["tag_name"]}</option>
                                                    ))
                                                ) : (
                                                    <option value="0">v0.0.0</option>
                                                )
                                            }
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                </Form>
                                <Card>
                                    <Card.Header>
                                        <Row className='p-2'>
                                            {
                                                (releases.length > 0) ? 
                                                    <h1>{releases[index]["name"]}</h1> :
                                                    <h1></h1>
                                            }
                                        </Row>
                                        <Row className='p-2'>   
                                            <Col md="5">
                                            {/* https://avatars.githubusercontent.com/in/15368?s=40&v=4 */}
                                                <Image
                                                    src={(releases.length > 0) ? 
                                                        (releases[index]["author"]["login"] === "github-actions[bot]") ? `https://avatars.githubusercontent.com/in/15368?s=40&v=4` : 
                                                        `https://github.com/${releases[index]["author"]["login"]}.png` : ""}
                                                    height="20"
                                                    className="d-inline-block rounded-circle"
                                                    alt={(releases.length > 0) ? releases[index]["author"]["login"] : ""}
                                                />
                                                {" "}
                                                {
                                                    
                                                    (releases.length > 0) ? 
                                                    releases[index]["author"]["login"] :
                                                    ""
                                                }
                                                {" "}released this{" "}
                                                {
                                                    (releases.length > 0) ? 
                                                    (new Date(releases[index]["published_at"])).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) :
                                                    ""
                                                }
                                            </Col>
                                            <Col md="4">
                                                {
                                                    (releases.length > 0) ? 
                                                    `版本：${releases[index]["tag_name"]} `:
                                                    ""
                                                }
                                            </Col>
                                            <Col md="3">
                                                {
                                                    (releases.length > 0) ? 
                                                   `分支：${releases[index]["target_commitish"]}` :
                                                    ""
                                                }
                                            </Col>
                                        </Row>
                                    </Card.Header>
                                    <Card.Body>
                                        {
                                            file !== undefined ? (
                                                <div dangerouslySetInnerHTML={{ __html: String(file) }} />
                                            ) : (
                                                ""
                                            )
                                        }
                                    </Card.Body>
                                    <Card.Footer>
                                        <Row>
                                            <h3>Assets:</h3>
                                        </Row>
                                        <Card>
                                            <Card.Body>
                                                {
                                                    (releases.length > 0) ?
                                                        assets.map((asset, index) => (
                                                            <Row key={index}>
                                                                <Col>
                                                                    {asset["name"]}
                                                                </Col>
                                                                <Col>
                                                                    {(asset["size"]/(1024*1024)).toFixed(2)} MB
                                                                </Col>
                                                                <Col>
                                                                    {
                                                                        (asset["name"] === "firmware.bin") ?  (
                                                                            <Button onClick={() => flash("firmware", asset["id"])}>Firmware Flash</Button>
                                                                        ) : (asset["name"] === "spiffs.bin") ?(
                                                                            <Button onClick={() => flash("spiffs", asset["id"])}>SPIFFS Flash</Button>
                                                                        ) : (
                                                                            <ButtonGroup>
                                                                                <Button onClick={() => flash("firmware", asset["id"])}>Firmware Flash</Button>
                                                                                <Button onClick={() => flash("spiffs", asset["id"])}>SPIFFS Flash</Button>
                                                                            </ButtonGroup>
                                                                        )
                                                                    }
                                                                </Col>
                                                            </Row>
                                                        )) : (
                                                            <></>
                                                        )
                                                }
                                            </Card.Body>
                                        </Card>
                                    </Card.Footer>
                                </Card>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Container>
        </main>
    );
}
export default OTA;