export const initialPostState = {
  post: {},
  loading: false,
  createLoading: false,
  error: null,
  timelinePosts: [],
  userPosts: [],
  comments: [], 
};

const postReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "CREATE_POST_REQUEST":
    case "CREATE_PROGRAM_POST_REQUEST":
      return {
        ...state,
        createLoading: true,
        error: null,
      };
    case "CREATE_POST_SUCCESS":
    case "CREATE_PROGRAM_POST_SUCCESS":
      return {
        ...state,
        post: payload,
        createLoading: false,
        error: null,
      };
    case "CREATE_POST_FAIL":
    case "CREATE_PROGRAM_POST_FAIL":
      return {
        ...state,
        createLoading: false,
        error: payload,
      };
    case "FETCH_POSTS_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "FETCH_POSTS_SUCCESS":
      return {
        ...state,
        timelinePosts: payload,
        loading: false,
        error: null,
      };
    case "FETCH_POSTS_FAIL":
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      throw new Error(`No case for type ${type} found in postReducer.`);
  }
};

export default postReducer;
