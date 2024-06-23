import React, { useState, useEffect, useRef } from "react";

const OPENAI_API_KEY =
  "xxxxxxxxxxxx";

// LoadingTextコンポーネントの定義
const LoadingText = ({ searchQuery }) => {
  const [visibleText, setVisibleText] = useState("");
  const fullText = `「${searchQuery}」 という情報を元に物件情報を探しています。少々お待ちください...`;

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setVisibleText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(intervalId);
    }, 100);
    return () => clearInterval(intervalId);
  }, [fullText]);

  return <p>{visibleText}</p>;
};

const PropertySearchApp = () => {
  const inputRef = useRef(null);
  const [searchResults, setSearchResults] = useState(null);
  const [rawResponse, setRawResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
      @keyframes spin { to { transform: rotate(360deg); } }
      body {
        font-family: 'Roboto', sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 0;
        color: #333;
      }
      * {
        box-sizing: border-box;
      }
    `;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleSearch = async () => {
    const query = inputRef.current.value;
    if (!query.trim()) return;
    setSearchQuery(query);
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `あなたは東京の賃貸物件を探す専門家です。ユーザーの質問に対して5つの物件情報を提供してください。以下のJSON形式で情報を返してください：
[
  {
    "name": "物件名（日本語）",
    "price": "月額家賃（円）",
    "squareFootage": "広さ（平方メートル）",
    "layout": "間取り（例：1LDK）",
    "address": "住所（日本語）",
    "nearestStation": "最寄り駅",
    "stationWalkTime": "最寄駅までの徒歩時間（分）",
    "gymWalkTime": "最寄りのボルダリングジムまでの徒歩時間（分）",
    "imageUrl": "その物件名で調べた時に一番最初にヒットする画像のURL",
    "nearestGym": {
      "name": "最寄りのボルダリングジム名",
      "location": "ボルダリングジムの住所",
      "siteUrl": "ボルダリングジムのホームページURL（埋め込み）",
      "mapUrl": "Google MapsのURL"
    }
  },
  {
    "name": "物件名（日本語）",
    "price": "月額家賃（円）",
    "squareFootage": "広さ（平方メートル）",
    "layout": "間取り（例：1LDK）",
    "address": "住所（日本語）",
    "nearestStation": "最寄り駅",
    "stationWalkTime": "最寄駅までの徒歩時間（分）",
    "gymWalkTime": "最寄りのボルダリングジムまでの徒歩時間（分）",
    "imageUrl": "その物件名で調べた時に一番最初にヒットする画像のURL",
    "nearestGym": {
      "name": "最寄りのボルダリングジム名",
      "location": "ボルダリングジムの住所",
      "siteUrl": "ボルダリングジムのホームページURL（埋め込み）",
      "mapUrl": "Google MapsのURL"
    }
  },
  {
    "name": "物件名（日本語）",
    "price": "月額家賃（円）",
    "squareFootage": "広さ（平方メートル）",
    "layout": "間取り（例：1LDK）",
    "address": "住所（日本語）",
    "nearestStation": "最寄り駅",
    "stationWalkTime": "最寄駅までの徒歩時間（分）",
    "gymWalkTime": "最寄りのボルダリングジムまでの徒歩時間（分）",
    "imageUrl": "その物件名で調べた時に一番最初にヒットする画像のURL",
    "nearestGym": {
      "name": "最寄りのボルダリングジム名",
      "location": "ボルダリングジムの住所",
      "siteUrl": "ボルダリングジムのホームページURL（埋め込み）",
      "mapUrl": "Google MapsのURL"
    }
  },
  {
    "name": "物件名（日本語）",
    "price": "月額家賃（円）",
    "squareFootage": "広さ（平方メートル）",
    "layout": "間取り（例：1LDK）",
    "address": "住所（日本語）",
    "nearestStation": "最寄り駅",
    "stationWalkTime": "最寄駅までの徒歩時間（分）",
    "gymWalkTime": "最寄りのボルダリングジムまでの徒歩時間（分）",
    "imageUrl": "その物件名で調べた時に一番最初にヒットする画像のURL",
    "nearestGym": {
      "name": "最寄りのボルダリングジム名",
      "location": "ボルダリングジムの住所",
      "siteUrl": "ボルダリングジムのホームページURL（埋め込み）",
      "mapUrl": "Google MapsのURL"
    }
  },
  {
    "name": "物件名（日本語）",
    "price": "月額家賃（数値の末尾に「円」をつけてください）",
    "squareFootage": "広さ（平方メートル）",
    "layout": "間取り（例：1LDK）",
    "address": "住所（日本語）",
    "nearestStation": "最寄り駅",
    "stationWalkTime": "最寄駅までの徒歩時間（数値の末尾に「分」をつけてください）",
    "gymWalkTime": "最寄りのボルダリングジムまでの徒歩時間（数値の末尾に「分」をつけてください）",
    "imageUrl": "その物件名で調べた時に一番最初にヒットする画像のURL",
    "nearestGym": {
      "name": "最寄りのボルダリングジム名",
      "location": "ボルダリングジムの住所",
      "siteUrl": "ボルダリングジムのホームページURL（埋め込み）",
      "mapUrl": "Google MapsのURL"
    }
  }
]
全てのフィールドを埋め、有効なJSON配列になるようにしてください。ユーザーの要望に合わない場合でも、なるべく近い条件の物件を提案してください。ジムの位置情報や公式ウェブサイトは、あなた自身でしっかりと調べて確実なものを返却してください。`,
              },
              { role: "user", content: query },
            ],
          }),
        },
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const content = data.choices[0].message.content;
      setRawResponse(content);
      setSearchResults(JSON.parse(content));
    } catch (error) {
      console.error("Search failed:", error);
      setRawResponse("エラーが発生しました。");
      setSearchResults(null);
    }
    setIsLoading(false);
  };

  const Card = ({ children, style }) => (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        padding: "20px",
        ...style,
      }}
    >
      {children}
    </div>
  );

  const Button = ({ onClick, disabled, children }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? "#cccccc" : "#1976d2",
        color: "white",
        border: "none",
        borderRadius: "4px",
        padding: "10px 20px",
        fontSize: "16px",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background-color 0.3s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </button>
  );

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1
        style={{
          textAlign: "center",
          color: "#1976d2",
          marginBottom: "30px",
          fontSize: "2.5rem",
        }}
      >
        物件検索アプリ
      </h1>
      <Card style={{ marginBottom: "30px" }}>
        <input
          type="text"
          ref={inputRef}
          placeholder="例：新宿都庁まで30分以内、ボルダリングジムに徒歩10分、家賃10万円以内の1LDK"
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            marginBottom: "20px",
          }}
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? (
            <>
              <div
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "20px",
                  border: "3px solid rgba(255,255,255,.3)",
                  borderRadius: "50%",
                  borderTopColor: "white",
                  animation: "spin 1s ease-in-out infinite",
                  marginRight: "10px",
                }}
              />
              検索中...
            </>
          ) : (
            "検索"
          )}
        </Button>
      </Card>
      {isLoading ? (
        <Card style={{ textAlign: "center" }}>
          <LoadingText searchQuery={searchQuery} />
        </Card>
      ) : (
        searchResults && (
          <Card>
            <h2 style={{ color: "#1976d2", marginBottom: "20px" }}>検索結果</h2>
            <div
              style={{
                display: "flex",
                overflowX: "auto",
                gap: "20px",
                padding: "10px 0",
                marginBottom: "20px",
              }}
            >
              {searchResults.slice(0, 5).map((property, index) => (
                <Card
                  key={index}
                  style={{ flex: "0 0 300px", padding: "15px" }}
                >
                  <h3 style={{ margin: "0 0 10px 0", color: "#1976d2" }}>
                    {property.name}
                  </h3>
                  <img
                    src={property.imageUrl}
                    alt={`${property.name}の画像`}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      marginBottom: "15px",
                    }}
                  />
                  <p>
                    <strong>家賃:</strong> {property.price}/月
                  </p>
                  <p>
                    <strong>広さ:</strong> {property.squareFootage}平米
                  </p>
                  <p>
                    <strong>間取り:</strong> {property.layout}
                  </p>
                  <p>
                    <strong>住所:</strong> {property.address}
                  </p>
                  <p>
                    <strong>最寄駅:</strong> {property.nearestStation}
                  </p>
                  <p>
                    <strong>駅まで徒歩:</strong> {property.stationWalkTime}
                  </p>
                  <p>
                    <strong>ボルダリングジムまで徒歩:</strong>{" "}
                    {property.gymWalkTime}
                  </p>
                  <Card
                    style={{ marginTop: "15px", backgroundColor: "#f5f5f5" }}
                  >
                    <h4 style={{ margin: "0 0 10px 0", color: "#1976d2" }}>
                      最寄りのボルダリングジム
                    </h4>
                    <p>
                      <strong>{property.nearestGym.name}</strong>
                    </p>
                    <p>{property.nearestGym.location}</p>
                    <a
                      href={property.nearestGym.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#1976d2", textDecoration: "none" }}
                    >
                      ジムのウェブサイト
                    </a>
                    <br />
                    <a
                      href={property.nearestGym.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#1976d2", textDecoration: "none" }}
                    >
                      地図で見る
                    </a>
                  </Card>
                </Card>
              ))}
            </div>
          </Card>
        )
      )}
      {rawResponse && (
        <Card style={{ marginTop: "30px" }}>
          <h2 style={{ color: "#1976d2", marginBottom: "20px" }}>
            生のAPI応答
          </h2>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              backgroundColor: "#f5f5f5",
              padding: "15px",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            {rawResponse}
          </pre>
        </Card>
      )}
    </div>
  );
};

export default PropertySearchApp;
