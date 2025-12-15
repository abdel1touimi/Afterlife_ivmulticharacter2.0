
import { players as mockPlayers } from "../components/charDetails/data/players";
import { defaultConfig } from "../providers/configDefaults";

const clonePlayers = () =>
  mockPlayers.map((player) => ({
    ...player,
    additionalInfo: { ...player.additionalInfo },
  }));

let devCharacters = clonePlayers();
let devScene = defaultConfig.Scenes?.[0]?.id || "";
let devSlots = 4;

// Short-circuit NUI calls when running Vite dev so the UI can render without FiveM.
const handleDevMock = (eventName, data) => {
  switch (eventName) {
    case "getConfig":
      return defaultConfig;
    case "GetCharacters":
      return devCharacters;
    case "getcurrentscene":
      return devScene;
    case "UpdateScene":
      devScene = data;
      return true;
    case "CreateCharacter":
      if (data?.slot) {
        devCharacters = devCharacters.map((player) =>
          player.id === data.slot
            ? {
                ...player,
                firstname: data.firstName || player.firstname,
                lastname: data.lastName || player.lastname,
                sex:
                  data.gender === "male"
                    ? true
                    : data.gender === "female"
                    ? false
                    : player.sex,
                emptyslot: false,
                additionalInfo: {
                  ...player.additionalInfo,
                  DOB: data.DOB || player.additionalInfo?.DOB,
                  nationality:
                    data.nationality || player.additionalInfo?.nationality,
                },
              }
            : player
        );
      }
      return true;
    case "DeleteCharacter":
      devCharacters = devCharacters.map((player) =>
        player.id === data
          ? {
              ...player,
              firstname: "First Name",
              lastname: "Last Name",
              img: "",
              emptyslot: true,
            }
          : player
      );
      return true;
    case "saveprofilepicture":
      devCharacters = devCharacters.map((player) =>
        player.id === data?.slot
          ? { ...player, img: data.img, emptyslot: false }
          : player
      );
      return devCharacters;
    case "GetAllCharacters":
      return devCharacters
        .filter((player) => !player.emptyslot)
        .map((player) => ({
          ...player,
          identifier: player.identifier || `dev-${player.id}`,
          job: player.job || player.additionalInfo?.type || "Civilian",
          cash: player.cash ?? player.additionalInfo?.currencyInHand ?? 0,
          bank: player.bank ?? player.additionalInfo?.currencyInBank ?? 0,
          dob: player.dob ?? player.additionalInfo?.DOB ?? "",
        }));
    case "GetSlots":
      return devSlots;
    case "updateslot":
      if (typeof data?.slot === "number") {
        devSlots = data.slot < 0 ? 0 : data.slot;
      }
      return devSlots;
    default:
      return true;
  }
};

export async function nuicallback(eventName, data) {
  if (import.meta.env.DEV) {
    return handleDevMock(eventName, data);
  }

  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
  };

  const resourceName = window.GetParentResourceName
    ? window.GetParentResourceName()
    : "nui-frame-app";

  const resp = await fetch(`https://${resourceName}/${eventName}`, options);

  const respFormatted = await resp.json();

  return respFormatted;
}
