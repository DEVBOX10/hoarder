import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { api } from "./utils/trpc";

export default function SavePage() {
  const [error, setError] = useState<string | undefined>(undefined);

  const { mutate: createBookmark, status } =
    api.bookmarks.createBookmark.useMutation({
      onError: (e) => {
        setError("Something went wrong: " + e.message);
      },
    });

  useEffect(() => {
    async function runSave() {
      let currentUrl;
      const [currentTab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      if (currentTab?.url) {
        currentUrl = currentTab.url;
      } else {
        setError("Couldn't find the URL of the current tab");
        return;
      }

      createBookmark({
        type: "link",
        url: currentUrl,
      });
    }
    runSave();
  }, [createBookmark]);

  switch (status) {
    case "error": {
      return <div className="text-red-500">{error}</div>;
    }
    case "success": {
      return <div className="m-auto text-lg">Bookmark Saved</div>;
    }
    case "pending": {
      return (
        <div className="m-auto">
          <Spinner />
        </div>
      );
    }
    case "idle": {
      return (
        <div className="m-auto">
          <Spinner />
        </div>
      );
    }
  }
}
