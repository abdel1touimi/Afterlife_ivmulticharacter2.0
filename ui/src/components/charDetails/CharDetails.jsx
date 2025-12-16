import React, { useEffect, useState } from "react";
import DeleteConfirm from "../confirmpage/deleteconfirm";
import { formatNumberToCurrency } from "../../utils/formatNumbersToCurrency";
import { nuicallback } from "../../utils/nuicallback";
import { players } from "./data/players";
import { useDispatch, useSelector } from "react-redux";
import { icons } from "./data/icons";
import settingsicon from "../../assets/setting.png";
import playicon from "../../assets/arrow.png";
import { updatescreen } from "../../store/screen/screen";
import { useConfig } from "../../providers/configprovider";
import profilepicture from "../../assets/profile.png";
import profilefemale from "../../assets/profile-female.png";
import createicon from "../../assets/create.png";

const CARD_WIDTH = 150;

const prettifyLabel = (label) => {
  if (!label) return "";
  if (label === label.toUpperCase()) return label;
  return label
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const CharDetails = () => {
  const [playersStore, SetPlayersStore] = useState(players);
  const [counter, setCounter] = useState(0);

  const { config } = useConfig();
  const dispatch = useDispatch();

  const scene = useSelector((state) => state.screen);

  useEffect(() => {
    nuicallback("GetCharacters").then((response) => {
      SetPlayersStore(response);
    });
  }, [scene]);

  const handleplay = () => {
    dispatch(updatescreen(""));
    nuicallback("playcharacter", playersStore[counter].id);
  };

  const handlecharacterswitch = (counter) => {
    setCounter(counter);

    let data = {
      emptyslot: playersStore[counter].emptyslot,
      counter: counter,
    };

    nuicallback("PreviewCharacter", data);
  };

  const handleQ = () => {
    if (counter !== 0) {
      nuicallback("click", false);
      handlecharacterswitch(counter - 1);
    }
  };
  const handleE = () => {
    if (counter < playersStore.length - 1) {
      nuicallback("click", true);

      handlecharacterswitch(counter + 1);
    }
  };

  useEffect(() => {
    const handlemessage = (event) => {
      switch (event.data.action) {
        case "characterselection":
          dispatch(updatescreen("characterselection"));
          SetPlayersStore(event.data.data);
          break;
      }
    };

    window.addEventListener("message", handlemessage);
    return () => window.removeEventListener("message", handlemessage);
  }, []);

  const currentPlayer = playersStore?.[counter];

  return (
    <>
      {scene == "deleteconfirm" ? (
        <DeleteConfirm id={counter + 1} />
      ) : (
        playersStore && currentPlayer && (
          <div
            style={{ display: scene == "characterselection" ? "flex" : "none" }}
            className="h-screen an vignette relative"
          >
            <div className="absolute top-[44%] left-[60px] translate-y-[-50%] outline-0 border-0 flex gap-4 items-baseline text-white">
              <div className="info-panel" key={currentPlayer.id}>
                <div className="info-panel__row">
                  <div className="info-chips">
                    <span className="info-chip info-chip--accent">
                      Slot #{currentPlayer.id}
                    </span>
                    <span className="info-chip">
                      {currentPlayer.additionalInfo.type || "CIVILIAN"}
                    </span>
                  </div>
                  <span className={`info-status ${currentPlayer.emptyslot ? "info-status--idle" : "info-status--active"}`}>
                    {currentPlayer.emptyslot ? "Empty" : "Ready"}
                  </span>
                </div>

                <div className="info-identity">
                  <div className="info-identity__last">
                    {currentPlayer.lastname}
                  </div>
                  <div className="info-identity__first">
                    {currentPlayer.firstname}
                  </div>
                </div>

                <div className="info-meta">
                  <div className="info-meta__item">
                    <span>Nationality</span>
                    <strong>{currentPlayer.additionalInfo.nationality || "Unknown"}</strong>
                  </div>
                  <div className="info-meta__item">
                    <span>Date of Birth</span>
                    <strong>{currentPlayer.additionalInfo.DOB || "--"}</strong>
                  </div>
                  <div className="info-meta__item">
                    <span>Bank</span>
                    <strong>{formatNumberToCurrency(currentPlayer.additionalInfo.currencyInBank ?? 0)}</strong>
                  </div>
                  <div className="info-meta__item">
                    <span>Cash</span>
                    <strong>{formatNumberToCurrency(currentPlayer.additionalInfo.currencyInHand ?? 0)}</strong>
                  </div>
                </div>

                <div className="info-divider"></div>

                <div className="info-quick">
                  {Object.keys(currentPlayer.additionalInfo).map((p, i) => {
                    const value = currentPlayer.additionalInfo[p];
                    const iconSrc = icons[i]?.icon;
                    return (
                      <div
                        key={p}
                        className="info-quick__item"
                        onMouseEnter={() => nuicallback("hover")}
                      >
                        <div className="info-quick__icon">
                          {iconSrc ? <img src={iconSrc} alt={p} /> : <span>{prettifyLabel(p).charAt(0)}</span>}
                        </div>
                        <div className="info-quick__body">
                          <div className="info-quick__label">{prettifyLabel(p)}</div>
                          <div className="info-quick__value">{formatNumberToCurrency(value)}</div>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => {
                      dispatch(updatescreen("settings"));
                      nuicallback("click");
                    }}
                    onMouseEnter={() => nuicallback("hover")}
                    className="info-quick__item info-quick__item--action"
                  >
                    <div className="info-quick__icon">
                      <img src={settingsicon} alt="settings" />
                    </div>
                    <div className="info-quick__body">
                      <div className="info-quick__label">Settings</div>
                      <div className="info-quick__value">Customize</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="character-bar">
              <div className="character-bar__header">
                <div>
                  <div className="character-bar__eyebrow">{config?.Lang?.character || "Character"}</div>
                  <div className="character-bar__title">{config?.Lang?.description || "Choose your character info"}</div>
                  <div className="character-bar__hint">Click any card to preview.</div>
                </div>
                <div className="character-bar__count">
                  <span>{String(counter + 1).padStart(2, "0")}</span>
                  <span className="divider">/</span>
                  <span>{String(playersStore.length).padStart(2, "0")}</span>
                </div>
              </div>

              <div className="character-window">
                <div
                  className="character-track"
                >
                  {playersStore.map((player, index) => {
                    const isActive = counter === index;
                    return (
                      <div
                        key={player.id}
                        className="character-card-shell"
                        style={{ width: `${CARD_WIDTH}px` }}
                        onMouseEnter={() => nuicallback("hover")}
                        onClick={() => handlecharacterswitch(index)}
                      >
                        <div
                          className={`char-card character-card ${isActive ? "active-card" : ""}`}
                          style={{
                            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%), url(${player.img}), url(${player.emptyslot ? createicon : player.sex ? profilepicture : profilefemale})`,
                            backgroundPosition: "center",
                          }}
                      >
                        <div className="character-card__top">
                          <span className="character-chip">
                            {player.job || player.additionalInfo?.type || "CIVILIAN"}
                          </span>
                            {isActive && !player.emptyslot && (
                              <button
                                className="character-delete"
                                onMouseEnter={() => nuicallback("hover")}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(updatescreen("deleteconfirm"));
                                  nuicallback("click");
                                }}
                                aria-label="Delete character"
                              >
                                <svg
                                  className="fill-current"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 448 512"
                                >
                                  <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                </svg>
                              </button>
                            )}
                          </div>
                          <div className="character-card__body">
                            <div className="character-card__lastname">
                              {player.emptyslot ? config?.Lang?.create || "CREATE" : player.lastname}
                            </div>
                          <div className="character-card__firstname">
                            {player.emptyslot ? "NEW SLOT" : player.firstname}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>

              <div className="character-footer">
                <button
                  onClick={handleplay}
                  onMouseEnter={() => nuicallback("hover")}
                  className="play-button"
                >
                  <img className="w-[18px]" src={playicon} alt="" />
                  <span>{config?.Lang?.enter || "Enter"}</span>
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default CharDetails;
