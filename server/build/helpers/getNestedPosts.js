"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getNestedPosts(posts) {
    var fetchedPosts = new Set();
    function dfs(post) {
        post.children = [];
        fetchedPosts.add(post.post_id);
        posts.forEach(function (post2) {
            if (!fetchedPosts.has(post2.post_id) && post2.parent_id == post.post_id) {
                post.children.push(dfs(post2));
            }
        });
        post.children.sort(function (a, b) {
            return a.created_at > b.created_at ? 1 : -1;
        });
        return post;
    }
    var nested = [];
    for (var _i = 0, posts_1 = posts; _i < posts_1.length; _i++) {
        var post = posts_1[_i];
        if (!fetchedPosts.has(post.post_id) && post.parent_id === null) {
            nested.push(dfs(post));
        }
    }
    nested.sort(function (a, b) {
        return a.created_at > b.created_at ? 1 : -1;
    });
    return nested;
}
exports.default = getNestedPosts;
