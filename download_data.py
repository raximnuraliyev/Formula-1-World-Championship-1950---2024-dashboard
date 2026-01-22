"""
F1 Dataset Downloader
Downloads the Formula 1 World Championship dataset from Kaggle
"""

import os
import shutil

def download_dataset():
    try:
        import kagglehub
        
        print("Downloading F1 World Championship dataset from Kaggle...")
        print("This may take a few minutes...")
        
        # Download latest version
        path = kagglehub.dataset_download("rohanrao/formula-1-world-championship-1950-2020")
        
        print(f"\nDataset downloaded to: {path}")
        
        # Get the directory where this script is located
        script_dir = os.path.dirname(os.path.abspath(__file__))
        dataset_dir = os.path.join(script_dir, "dataset")
        
        # Create dataset directory if it doesn't exist
        os.makedirs(dataset_dir, exist_ok=True)
        
        # Copy all CSV files to the dataset directory
        print(f"\nCopying files to: {dataset_dir}")
        
        for filename in os.listdir(path):
            if filename.endswith('.csv'):
                src = os.path.join(path, filename)
                dst = os.path.join(dataset_dir, filename)
                shutil.copy2(src, dst)
                print(f"  Copied: {filename}")
        
        print("\n✅ Dataset ready! You can now run the dashboard.")
        print("\nFiles available:")
        for f in sorted(os.listdir(dataset_dir)):
            if f.endswith('.csv'):
                print(f"  - {f}")
                
    except ImportError:
        print("❌ kagglehub not installed. Installing now...")
        os.system("pip install kagglehub")
        print("\nPlease run this script again.")
        
    except Exception as e:
        print(f"❌ Error downloading dataset: {e}")
        print("\nAlternative: Download manually from:")
        print("https://www.kaggle.com/datasets/rohanrao/formula-1-world-championship-1950-2020")
        print(f"\nThen extract CSV files to: {os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dataset')}")

if __name__ == "__main__":
    download_dataset()
