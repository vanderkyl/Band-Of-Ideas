// TEST DATA //

// Test User Object
var testUser = {
  id: "1",
  bands: [
    {id: "0",
     name: "Test Band",
     metaName: "test_band",
     memberIds: ["1"],
     code: "1234"}
  ],
  name: "Test User",
  email: "test@test.com",
  password: "1234",
  passwordAgain: "1234"
};

// Test Folder Objects
var testFolders = [{
  bandId: "0",
  id: "0",
  name: "Test Folder",
  metaName: "test_folder",
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
}];

// Test File Objects
var testFiles = [{
    folderId: "0",
    id: "0",
    likes: "1",
    userLikes: ["1"],
    link: "/test-data/Lazer.m4a",
    name: "Test File",
    metaName: "test_file",
    size: "34637",
    type: "audio/x-m4a",
    views: "0",
    comments: [{id:1, comment:"laskjdflk", userName:"user", commentTime: "Nov 14th"}, {id:2, comment:"asdffasd", userName:"user2", commentTime: "Nov 14th"},
              {id:3, comment:"laskjdflkdfasdfdf dfdf", userName:"user3", commentTime: "Nov 14th"}, {id:4, comment:"laskjdflk", userName:"user", commentTime: "Nov 14th"},
              {id:4, comment:"laskjdflfdff dffsdfd dfdafsdfasdfasfasdfddf dfdfdasfsdfdsfd df dfdfdk", userName:"user", commentTime: "Nov 14th"},
              {id:5, comment:"laskjdf", userName:"user4", commentTime: "Nov 14th"}, {id:6, comment:"laskjdf", userName:"user4", commentTime: "Nov 14th"}],
    highlights: [{id:1, comment:"laskjdflk", userName:"user", commentTime: "Nov 14th", highlightTime: "40.12"}, {id:2, comment:"asdffasd", userName:"user2", commentTime: "Nov 14th", highlightTime: "0.12"},
              {id:3, comment:"laskjdflkdfasdfdf dfdf", userName:"user3", commentTime: "Nov 14th", highlightTime: 60.12}, {id:4, comment:"laskjdflk", userName:"user", commentTime: "Nov 14th", highlightTime: 0.12},
              {id:4, comment:"laskjdflfdff dffsdfd dfdafsdfasdfasfasdfddf dfdfdasfsdfdsfd df dfdfdk", userName:"user", commentTime: "Nov 14th", highlightTime: 0.12},
              {id:5, comment:"laskjdf", userName:"user4", commentTime: "Nov 14th",  highlightTime: 0.12}, {id:6, comment:"laskjdf", userName:"user4", commentTime: "Nov 14th", highlightTime: 0.12}]

  },
  {
    folderId: "0",
    id: "1",
    likes: "0",
    userLikes: ["1"],
    link: "/test-data/Lazer.m4a",
    name: "Test File2",
    metaName: "test_file",
    size: "34637",
    type: "audio/x-m4a",
    views: "0",
    comments: []
  },
  {
    folderId: "0",
    id: "2",
    likes: "0",
    userLikes: ["1"],
    link: "/test-data/Lazer.m4a",
    name: "Test File3",
    metaName: "test_file",
    size: "34637",
    type: "audio/x-m4a",
    views: "0",
    comments: [],
    comments: []
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
    comments: []
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
    comments: []
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
    comments: []
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
    comments: []
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
    comments: []
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
    comments: []
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
    comments: [{id:1, comment:"laskjdflk", userName:"user"}]
  }
];
// END OF TEST DATA
