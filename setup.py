"""Setup configuration for Gmail Smart Cleaner."""
from setuptools import setup, find_packages
from pathlib import Path

# Read README
readme_file = Path(__file__).parent / "README.md"
long_description = readme_file.read_text() if readme_file.exists() else ""

# Read requirements
requirements_file = Path(__file__).parent / "requirements.txt"
requirements = []
if requirements_file.exists():
    requirements = [
        line.strip()
        for line in requirements_file.read_text().splitlines()
        if line.strip() and not line.startswith("#")
    ]

setup(
    name="gmail-smart-cleaner",
    version="0.1.0",
    description="Smart email cleaner for Gmail with advanced filtering capabilities",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="Gmail Smart Cleaner Contributors",
    url="https://github.com/srwaditya/Gmail-Smart-Cleaner",
    packages=find_packages(),
    install_requires=requirements,
    entry_points={
        "console_scripts": [
            "gmail-cleaner=cli.main:cli",
        ],
    },
    python_requires=">=3.8",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: End Users/Desktop",
        "Topic :: Communications :: Email",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
    keywords="gmail email cleaner automation productivity",
)
