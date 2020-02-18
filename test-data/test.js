// TEST DATA //

var members = [
    {id: "1", name: "kyle", email: "vanderfry", password: "1234", bands: [], email: "vanderfry"},
    {id: "1", name: "kyle", email: "vanderfry", password: "1234", bands: [], email: "vanderfry"}
    ];


// Test User Object
var testBand = {
    id: "-1",
    name: "Test Band",
    metaName: "test_band",
    members: ["1", "2"],
    code: "1234",
    numFiles: 23
};

var testFolder = {
  bandId: "-1",
  id: "-1",
  name: "Test Folder",
  metaName: "test_folder",
  parentId: "0",
  archived: "true"
};

var testUser = {
  id: "1",
  bands: [
    testBand,
      {id: "-1",
          name: "Test Band 2",
          metaName: "test_band_2",
        members: ["1", "2"],
          code: "1234",
          numFiles: 30
      }
  ],
  name: "Test User",
  email: "test@test.com",
  password: "1234",
  passwordAgain: "1234",
  userIcon: "../img/vocal-profile.png"
};

// Test Folder Objects
var testFolders = [
{
  bandId: "0",
  id: "1",
  name: "Test Folder2",
  metaName: "test_folder2",
  parentId: "0",
  archived: "true"
},
    {
        bandId: "0",
        id: "1",
        name: "Test Folder2",
        metaName: "test_folder2",
        parentId: "0",
        archived: "true"
    },
    {
        bandId: "0",
        id: "1",
        name: "Test Folder2",
        metaName: "test_folder2",
        parentId: "0",
        archived: "true"
    },
    {
        bandId: "0",
        id: "1",
        name: "Test Folder2",
        metaName: "test_folder2",
        parentId: "0",
        archived: "true"
    },
    {
        bandId: "0",
        id: "1",
        name: "Test Folder2",
        metaName: "test_folder2",
        parentId: "0",
        archived: "true"
    },
    {
        bandId: "0",
        id: "1",
        name: "Test Folder2",
        metaName: "test_folder2",
        parentId: "0",
        archived: "true"
    },
    {
        bandId: "0",
        id: "1",
        name: "Test Folder2",
        metaName: "test_folder2",
        parentId: "0",
        archived: "true"
    },
    {
        bandId: "0",
        id: "1",
        name: "Test Folder2",
        metaName: "test_folder2",
        parentId: "0",
        archived: "true"
    },
    {
        bandId: "0",
        id: "1",
        name: "Test Folder2",
        metaName: "test_folder2",
        parentId: "0",
        archived: "true"
    },
    {
        bandId: "0",
        id: "1",
        name: "Test Folder2",
        metaName: "test_folder2",
        parentId: "0",
        archived: "true"
    },
    {
        bandId: "0",
        id: "1",
        name: "Test Folder2",
        metaName: "test_folder2",
        parentId: "0",
        archived: "true"
    },testFolder];

// Test File Objects
var testFiles = [{
    folderId: "0",
    id: "0",
    likes: "1",
    userLikes: [{id: 6,name: "user"}],
    link: "/test-data/Lazer.m4a",
    name: "Test File",
    metaName: "test_file",
    size: "34637",
    source: "https://drive.google.com/file/d/1DSXuOn0pjdwjxPMaR8QeR7dUWfGX_Moh/preview",
    type: "audio/x-m4a",
    views: "0",
    comments: [{id:1, comment:"laskjdflk", userName:"user", commentTime: "Nov 14th"}, {id:2, comment:"asdffasd", userName:"user2", commentTime: "Nov 14th"},
              {id:3, comment:"laskjdflkdfasdfdf dfdf", userName:"user3", commentTime: "Nov 14th"}, {id:4, comment:"laskjdflk", userName:"user", commentTime: "Nov 14th"},
              {id:4, comment:"laskjdflfdff dffsdfd dfdafsdfasdfasfasdfddf dfdfdasfsdfdsfd df dfdfdk", userName:"user", commentTime: "Nov 14th"},
              {id:5, comment:"laskjdf", userName:"user4", commentTime: "Nov 14th"}, {id:6, comment:"laskjdf", userName:"user4", commentTime: "Nov 14th"}],
    highlights: [{id:1, comment:"laskjdflk", userName:"user", commentTime: "Nov 14th", highlightTime: 40.12, endTime: 115.45},
                {id:2, comment:"asdffasd", userName:"user2", commentTime: "Nov 14th", highlightTime: 0, endTime: 0},
                {id:3, comment:"laskjdflkdfasdfdf dfdf", userName:"user3", commentTime: "Nov 14th", highlightTime: 60.12, endTime: 0},
                {id:4, comment:"laskjdflk", userName:"user", commentTime: "Nov 14th", highlightTime: 5.12, endTime: 15.45},
                {id:4, comment:"laskjdflfdff dffsdfd dfdafsdfasdfasfasdfddf dfdfdasfsdfdsfd df dfdfdk", userName:"user", commentTime: "Nov 14th", highlightTime: 0.12, endTime: 15.45},
                {id:5, comment:"laskjdf", userName:"user4", commentTime: "Nov 14th",  highlightTime: -1, endTime: 45.45},
                {id:6, comment:"laskjdf", userName:"user4", commentTime: "Nov 14th", highlightTime: 90.12, endTime: 99.45}]

  },
  {
    folderId: "0",
    id: "1",
    likes: "0",
    userLikes: [],
    link: "/test-data/Lazer.m4a",
    name: "Test File2",
    metaName: "test_file",
      source: "",
    size: "34637",
    type: "audio/x-m4a",
    views: "0",
    comments: [],
    highlights: []
  },
  {
    folderId: "0",
    id: "2",
    likes: "0",
    userLikes: ["1"],
    link: "/test-data/Lazer.m4a",
    name: "Test File3",
    metaName: "test_file",
      source: "",
    size: "34637",
    type: "audio/x-m4a",
    views: "0",
    comments: [],
    highlights: []
  },
  {
    folderId: "0",
    id: "3",
    likes: "0",
    userLikes: ["1"],
    link: "/uploads/bands/1/1/8-Bit.m4a",
    name: "Test File4",
    metaName: "test_file",
    size: "34637",
    type: "audio/x-m4a",
    views: "0",
    comments: [],
      highlights: []
  },
  {
    folderId: "0",
    id: "4",
    likes: "0",
    userLikes: ["1"],
    link: "/uploads/bands/1/1/8-Bit.m4a",
    name: "Test File5",
    metaName: "test_file",
    size: "34637",
    type: "audio/x-m4a",
    views: "0",
    comments: [],
      highlights: []
  },
  {
    folderId: "0",
    id: "5",
    likes: "0",
    userLikes: ["1"],
    link: "/uploads/bands/1/1/8-Bit.m4a",
    name: "Test File6",
    metaName: "test_file",
    size: "34637",
    type: "audio/x-m4a",
    views: "0",
    comments: [],
      highlights: []
  },
  {
    folderId: "0",
    id: "6",
    likes: "0",
    userLikes: ["1"],
    link: "/uploads/bands/1/1/8-Bit.m4a",
    name: "Test File7",
    metaName: "test_file",
    size: "34637",
    type: "audio/x-m4a",
    views: "0",
    comments: [],
      highlights: []
  },
  {
    folderId: "0",
    id: "7",
    likes: "0",
    userLikes: ["1"],
    link: "/uploads/bands/1/1/8-Bit.m4a",
    name: "Test File8",
    metaName: "test_file",
    size: "34637",
    type: "audio/x-m4a",
    views: "0",
    comments: [],
      highlights: []
  },
  {
    folderId: "0",
    id: "8",
    likes: "0",
    userLikes: ["1"],
    link: "/uploads/bands/1/1/8-Bit.m4a",
    name: "Test File10",
    metaName: "test_file",
    size: "34637",
    type: "audio/x-m4a",
    views: "0",
    comments: []
  },
  {
    folderId: "0",
    id: "9",
    likes: "0",
    userLikes: ["1"],
    link: "/uploads/bands/1/1/8-Bit.m4a",
    name: "Test File11",
    metaName: "test_file",
    size: "34637",
    type: "audio/x-m4a",
    views: "0",
    comments: [],
      highlights: []
  },
  {
    folderId: "0",
    id: "10",
    likes: "0",
    userLikes: ["1"],
    link: "/uploads/bands/1/1/8-Bit.m4a",
    name: "Test File9",
    metaName: "test_file9",
    size: "34637",
    type: "audio/x-m4a",
    views: "0",
    comments: [{id:1, comment:"laskjdflk", userName:"user"}],
      highlights: []
  }
];
// END OF TEST DATA
