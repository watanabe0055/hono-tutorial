import { Hono } from "hono";

const app = new Hono();

let blogPosts = [
  {
    id: "1",
    title: "First Blog Post",
    content: "This is the first blog post",
  },
  {
    id: "2",
    title: "Second Blog Post",
    content: "This is the",
  },
];

app.get("/", (c) => {
  return c.json({ posts: blogPosts });
});

app.get("/:id", (c) => {
  const id = c.req.param("id");
  const post = blogPosts.find((p) => p.id === id);
  if (!post) {
    return c.json({ error: "not found this page" }, 404);
  }
  return c.json({ post });
});

app.post("/", async (c) => {
  const { title, content } = await c.req.json<{
    title: string;
    content: string;
  }>();
  const newPosts = { id: String(blogPosts.length + 1), title, content };
  blogPosts = [...blogPosts, newPosts];
  return c.json(newPosts, 201);
});

app.put("/:id", async (c) => {
  const id = c.req.param("id");
  const index = blogPosts.findIndex((p) => p.id === id);

  if (index === -1) {
    return c.json({ error: "post not found" }, 404);
  }

  const { title, content } = await c.req.json();

  blogPosts[index] = { ...blogPosts[index], title, content };
  return c.json(blogPosts[index]);
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const index = blogPosts.findIndex((p) => p.id === id);

  if (index === -1) {
    return c.json({ error: "post not found" }, 404);
  }

  blogPosts = blogPosts.filter((p) => p.id !== id);
  return c.json({ message: "post deleted" });
});

export default app;
