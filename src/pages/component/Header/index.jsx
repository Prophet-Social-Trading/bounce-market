import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import { Button, PullRadioBox } from "../../../components/UI-kit";
import Search from "./Search";
import InfoBox from "./InfoBox";

import logo_bounce from "@assets/images/logo/bounce.svg";
/* import logo_bfangible from '@assets/images/logo/fangible.svg' */
import ConnectWalletModal from "@components/Modal/ConnectWallet";
import { useActiveWeb3React } from "@/web3";
import { useWalletConnect } from "@/web3/useWalletConnect";
import { useUserInfo } from "../../Myprofile/useUserInfo";
import { Tooltip } from "@material-ui/core";
import { myContext } from "@/redux/index.js";
import useWrapperIntl from "@/locales/useWrapperIntl";

const HeaderStyled = styled.div`
	height: 76px;
	width: 100%;
	min-width: 1100px;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid rgba(3, 3, 3, 0.1);
	user-select: none;
	box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.1);

	.wrapper {
		width: 1100px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;

		> div {
			display: flex;
			align-items: center;

			&.left {
			}

			&.right {
				ul.nav {
					display: flex;
					align-items: center;
					margin-right: 4px;
					li {
						h5 {
							font-size: 16px;
							margin-right: 28px;

							color: rgba(0, 0, 0, 0.4);

							&:hover {
								color: rgba(0, 0, 0, 0.6);
							}
						}


						&.active h5 {
							color: rgba(0, 0, 0, 1);
						}
					}
				}

				button {
					margin-right: 20px;
				}
			}
		}
	}

	.avatar_box {
		width: 32px;
		height: 76px;
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		border-top: 2px solid rgba(255, 255, 255, 0.1);
		border-bottom: 2px solid rgba(255, 255, 255, 0.1);

		&.open {
			border-top: 2px solid rgba(255, 255, 255, 0.1);
			border-bottom: 2px solid #124eeb;
		}

		img {
			width: 28px;
			height: 28px;
			border-radius: 50%;
			cursor: pointer;
		}

		.avatar {
			width: 28px;
			height: 28px;
			border-radius: 50%;
			background: linear-gradient(
				154.16deg,
				#306aff 6.12%,
				#3e74fe 49.44%,
				#003bd3 89.29%
			);
			cursor: pointer;
		}
	}
`;


const ConnectToChain = async (chainName) => {
    let ethereum = window.ethereum;

    // if (typeof ethereum !== "undefined") {
    //     console.log("MetaMask is installed!");
    // }

    const BSCInfo = [
        {
            chainId: "0x38",
            chainName: "Binance Smart Chain Mainnet",
            nativeCurrency: {
                name: "BNB",
                symbol: "BNB",
                decimals: 18,
            },
            /* rpcUrls: ["https://bsc-dataseed.binance.org/"], */
            rpcUrls: ["https://bsc-dataseed4.binance.org"],
            blockExplorerUrls: ["https://bscscan.com/"],
        },
    ];

    const HECOInfo = [
        {
            chainId: "0x80",
            chainName: "Huobi ECO Chain Mainnet",
            nativeCurrency: {
                name: "HT",
                symbol: "HR",
                decimals: 18,
            },
            rpcUrls: ["https://http-mainnet.hecochain.com"],
            blockExplorerUrls: ["https://scan.hecochain.com"],
        },
    ];

    const result = await ethereum
        .request({
            method: "wallet_addEthereumChain",
            params: chainName === "BSC" ? BSCInfo : HECOInfo,
        })
        .then(() => {
            // window.location.reload();
        })
        .catch();
    if (result) {
        console.log(result);
    }

    window.localStorage.setItem('currentChainId', chainName === "BSC" ? 56 : 128)
    window.location.reload();

};

export default function Index() {
    const [isConnectWallect, setIsConnectWallect] = useState(false);
    const { onConnect } = useWalletConnect();
    const [curNav, setCurNav] = useState("Home");
    const { account, chainId, active } = useActiveWeb3React();
    const [isShowInfo, setIsShowInfo] = useState(!true);
    const { getUserInfo } = useUserInfo();
    const history = useHistory();
    const { state, dispatch } = useContext(myContext);
    // const { dispatch } = useContext(myContext);
    /* const [isFangible, setIsFangible] = useState(false) */
    const { wrapperIntl } = useWrapperIntl();
    const defaultNetwork = window.localStorage.getItem('currentChainId') === '128' ? 'HECO' : 'BSC'


    const Nav_list = [
        {
            name: wrapperIntl("header.home"),
            route: "/Home",
            enable: true,
        },
        {
            name: wrapperIntl("header.marketplace"),
            route: "/Marketplace",
            enable: true,
        },
        {
            name: wrapperIntl("header.brands"),
            route: "/Brands",
            enable: true,
        },
    ];

    const updateActive = () => {
        const pathName = window.location.pathname;
        Nav_list.forEach((element) => {
            if (pathName.indexOf(element.route) !== -1) {
                setCurNav(element.name);
            }
        });
        /* if (
            pathName === '/MyGallery' ||
            pathName === '/MyActivities' ||
            pathName === '/MyLiked' ||
            pathName === '/MyBrands'
        ) {
            setIsFangible(true)
        } else {
            setIsFangible(false)
        } */
    };
    const connectWallet = (historyLocation) => {
        const match = [
            /* '/Marketplace/FineArts/english-auction/',
            '/Marketplace/FineArts/fixed-swap/',
            '/AirHome/', */
        ];
        if (
            match.some(
                (path) =>
                    historyLocation.pathname.substring(0, path.length) === path
            )
        ) {
            onConnect();
        }
        updateActive();
    };
    useEffect(() => {
        const type = window.localStorage.getItem("BOUNCE_SELECT_WALLET");
        if (type) {
            onConnect(type);
        }

        updateActive();
        connectWallet(history.location);
        history.listen(connectWallet);

        // eslint-disable-next-line
    }, [history]);

    const findTopElement = (e) => {
        if (e.tagName === "BODY") return false;
        // console.log(e, e.getAttribute('class'))
        if (e.getAttribute("class")?.indexOf("setting-account-modal") >= 0) {
            return true;
        } else {
            if (e && e.parentNode) {
                return findTopElement(e.parentNode);
            } else {
                return false;
            }
        }
    };
    const eventShowInfo = (e) => {
        try {
            if (
                [
                    ...document.getElementsByClassName("setting-account-modal"),
                ].findIndex((t) => t.contains(e.target)) !== -1
            ) {
                return;
            }
        } catch (error) {
            if (findTopElement(e.target)) return;
        }

        // SettingAccountModal
        setIsShowInfo(false);
    };
    const onBodyHandle = () =>
        document.body.addEventListener("click", eventShowInfo);
    const offBodyHandle = () =>
        document.body.removeEventListener("click", eventShowInfo);
    useEffect(() => {
        onBodyHandle();
        return offBodyHandle;
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        /* console.log("active: ", active) */
        let activeTimeout;
        if (!active) {
            activeTimeout = setTimeout(() => {
                dispatch({
                    type: "Modal_Message",
                    showMessageModal: true,
                    modelType: "error",
                    modelMessage: wrapperIntl("ConnectWallet"),
                    modelTimer: 24 * 60 * 60 * 1000,
                    subsequentActionType: "connectWallet",
                    modelUrlMessage: wrapperIntl("header.ConnectWallet"),
                    subsequentActionFunc: setIsConnectWallect,
                });
            }, 500);
            return () => {
                clearTimeout(activeTimeout);
            };
        }
        // eslint-disable-next-line
    }, [active]);

    useEffect(() => {
        dispatch({
            type: "Modal_Message",
            showMessageModal: false,
            modelType: "error",
            modelMessage: "",
            modelUrlMessage: "",
        });

        if (active && chainId === 56) {
            getUserInfo();
            return;
        }

        window.localStorage.LastChainId = chainId;

        getUserInfo();
        // eslint-disable-next-line
    }, [account, chainId, active]);

    const onHandleShowInfo = (e) => {
        window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
        setIsShowInfo(!isShowInfo);
    };

    return (
        <>
            <HeaderStyled>
                <div className="wrapper">
                    <div className="left">
                        <Link to="/">
                            <img
                                src={
									/* isFangible ? logo_bfangible : */ logo_bounce
                                }
                                alt=""
                            ></img>
                        </Link>

                        <Search placeholder={wrapperIntl("header.search_p")} />
                    </div>
                    <div className="right">
                        {false &&
                            window.location.hostname.includes("localhost") && (
                                <Button
                                    width="100px"
                                    height="36px"
                                    value="中文"
                                    onClick={() => {
                                        window.localStorage.setItem(
                                            "Language",
                                            "zh-CN"
                                        );
                                        window.location.reload();
                                    }}
                                />
                            )}

                        {false &&
                            window.location.hostname.includes("localhost") && (
                                <Button
                                    width="100px"
                                    height="36px"
                                    value="English"
                                    onClick={() => {
                                        window.localStorage.setItem(
                                            "Language",
                                            "en-US"
                                        );
                                        window.location.reload();
                                    }}
                                />
                            )}
                        <ul className="nav">
                            {Nav_list.map((item) => {
                                return item.enable ? (
                                    <li
                                        key={item.name}
                                        className={
                                            item.name === curNav ? "active" : ""
                                        }
                                        onClick={() => {
                                            window.localStorage.setItem(
                                                "Herder_CurNav",
                                                item.name
                                            );
                                            setCurNav(item.name);
                                        }}
                                    >
                                        <Link to={item.route}>
                                            <h5>{item.name}</h5>
                                        </Link>
                                    </li>
                                ) : (
                                    <Tooltip
                                        key={item.name}
                                        title="Coming soon"
                                    >
                                        <li style={{ opacity: 0.5 }}>
                                            <h5>{item.name}</h5>
                                        </li>
                                    </Tooltip>
                                );
                            })}
                        </ul>

                        <Button
                            width="110px"
                            height="36px"
                            value={wrapperIntl("header.create")}
                            onClick={() => {
                                history.push("/Factory");
                            }}
                        />

                        <PullRadioBox
                            width={"100px"}
                            options={[
                                {
                                    value: "BSC",
                                },
                                {
                                    value: "HECO",
                                },
                            ]}
                            borderHidden
                            defaultValue={defaultNetwork}
                            onValChange={(item) => {
                                // console.log(item,defaultNetwork)
                                if (defaultNetwork !== item) {
                                    ConnectToChain(item)
                                }
                            }}
                        />

                        {active ? (
                            <div
                                className={`avatar_box ${isShowInfo ? "open" : ""
                                    }`}
                            >
                                {state.userInfo && state.userInfo.imgurl ? (
                                    <img
                                        src={
                                            state.userInfo &&
                                            state.userInfo.imgurl
                                        }
                                        alt=""
                                        onClick={onHandleShowInfo}
                                    />
                                ) : (
                                    <div
                                        className="avatar"
                                        onClick={onHandleShowInfo}
                                    ></div>
                                )}
                            </div>
                        ) : (
                            <Button
                                className="connect_btn"
                                primary
                                onClick={() => {
                                    setIsConnectWallect(true);
                                }}
                            >
                                {wrapperIntl("header.connect")}
                            </Button>
                        )}
                    </div>
                    {isShowInfo && (
                        <InfoBox
                            onBodyHandle={onBodyHandle}
                            offBodyHandle={offBodyHandle}
                            setIsShowInfo={setIsShowInfo}
                            username={state.userInfo && state.userInfo.username}
                        />
                    )}
                </div>
            </HeaderStyled>
            <ConnectWalletModal
                open={isConnectWallect}
                setOpen={setIsConnectWallect}
            />
        </>
    );
}
