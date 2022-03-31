const { newRequestForApiGraphQL } = require("../../utils/newRequestForApi");
const { createQueryLoginUser } = require("../users/functions/querys");

const { activityOne, activityTwo } = require("../../params");

const {
  createQueryNewActivity,
  createQueryActivityById,
} = require("./functions/querys");

const headers = {
  "Content-Type": "application/json",
};

const baseURL = "https://api-stg.sportidia.com/graphql";
let token;
let headersLoged;

describe("Create Activities", () => {
  beforeAll(async () => {
    const query = createQueryLoginUser({
      email: "eduardo.verri@sptech.school",
      password: "teste123",
    });

    const response = await newRequestForApiGraphQL(baseURL, query);

    const { body } = response;
    token = body.data.login.token;

    headersLoged = {
      ...headers,
      authorization: `Bearer ${token}`,
    };
  });

  it("Create a new activities", async () => {
    const data = {
      title: activityOne.title,
      image_url:
        "https://res.cloudinary.com/sportidia/image/upload/v1648148819/ohj0en4augmsndrggskt.jpg",
      description: "Vamos nos exercitar",
      skill_levels: activityOne.skill_levels,
      privacy: activityOne.privacy,
      location_city: "São Paulo",
      location_state: "São Paulo",
      location_lat: -23.5668698,
      location_long: -46.6608874,
      date: activityOne.date,
      begins_at: activityOne.begins_at,
      sport_id: activityOne.sport_id,
      author_id: activityOne.author_id,
    };

    const queryCreateActivity = createQueryNewActivity(data);

    const responseActivity = await newRequestForApiGraphQL(
      baseURL,
      queryCreateActivity,
      headersLoged
    );

    const activity = responseActivity.body.data.activityRegister;

    const newData = {
      title: activityTwo.title,
      image_url:
        "https://res.cloudinary.com/sportidia/image/upload/v1648148819/ohj0en4augmsndrggskt.jpg",
      description: "Venha Correr com a gente",
      skill_levels: activityTwo.skill_levels,
      privacy: activityTwo.privacy,
      location_city: "São Paulo",
      location_state: "São Paulo",
      location_lat: -23.5668698,
      location_long: -46.6608874,
      date: activityTwo.date,
      begins_at: activityTwo.begins_at,
      sport_id: activityTwo.sport_id,
      author_id: activityTwo.author_id,
    };

    const queryCreateNewActivity = createQueryNewActivity(newData);

    const responseNewActivity = await newRequestForApiGraphQL(
      baseURL,
      queryCreateNewActivity,
      headersLoged
    );

    const newActivity = responseNewActivity.body.data.activityRegister;

    const queryListActivity = createQueryActivityById(newActivity.id);

    const responseListActivity = await newRequestForApiGraphQL(
      baseURL,
      queryListActivity,
      headersLoged
    );

    const queryListNewActivity = createQueryActivityById(activity.id);

    const responseListNewActivity = await newRequestForApiGraphQL(
      baseURL,
      queryListNewActivity,
      headersLoged
    );

    expect(responseListActivity.body.data.findActivities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: activityTwo.title,
        }),
      ])
    );

    expect(responseListNewActivity.body.data.findActivities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: activityOne.title,
        }),
      ])
    );
  });
});
