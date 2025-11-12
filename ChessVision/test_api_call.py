#!/usr/bin/env python3
"""
Test script to call the ChessVision API with a test image
"""
import requests
import base64
import json
from PIL import Image
import io


def test_api_with_image(image_path, player="w", white_or_black_top="black"):
    """
    Test the ChessVision API with a given image

    Args:
        image_path: Path to the chess board image
        player: Current player ('w' or 'b')
        white_or_black_top: Which color is at top of image ('white' or 'black')
    """
    # Read and encode the image
    with open(image_path, "rb") as image_file:
        image_data = image_file.read()
        encoded_image = base64.b64encode(image_data).decode("utf-8")

    # Prepare the request
    url = "http://localhost:5000/process_image"
    payload = {
        "image": encoded_image,
        "player": player,
        "white_or_black_top": white_or_black_top,
    }

    print(f"🎯 Testing API with image: {image_path}")
    print(f"   Player: {player}")
    print(f"   Orientation: {white_or_black_top} on top")
    print(f"   Sending request to {url}...")

    try:
        response = requests.post(url, json=payload, timeout=60)

        if response.status_code == 200:
            result = response.json()
            print("\n✅ SUCCESS!")
            print(f"   Status Code: {response.status_code}")

            # Display FEN notation
            if "fen" in result:
                print(f"\n♟️  FEN Notation:")
                print(f"   {result['fen']}")

            # Display Lichess URL
            if "lichess_url" in result:
                print(f"\n🔗 Lichess Analysis URL:")
                print(f"   {result['lichess_url']}")
                print(f"   (Open this URL in your browser to analyze the position)")

            # Decode and save the SVG
            svg_data = base64.b64decode(result["svg"])
            output_path = "output_board.svg"
            with open(output_path, "wb") as f:
                f.write(svg_data)

            print(f"\n💾 SVG output saved to: {output_path}")
            print("\n📊 SVG Preview (first 300 chars):")
            print(svg_data.decode("utf-8")[:300] + "...")

        else:
            print(f"\n❌ ERROR!")
            print(f"   Status Code: {response.status_code}")
            print(f"   Response: {response.text}")

    except requests.exceptions.ConnectionError:
        print("\n❌ CONNECTION ERROR!")
        print("   Make sure the API is running on http://localhost:5000")
        print("   Start it with: python run_api.py")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")


if __name__ == "__main__":
    # Test with img_2.jpg
    test_api_with_image(
        "images/test_images/img_3.jpg", player="w", white_or_black_top="black"
    )
